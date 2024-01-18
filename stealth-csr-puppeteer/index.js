const { Cluster } = require('puppeteer-cluster');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const fs = require('fs');
const { getChromeProfilePath, getChromeExecutablePath } = require('./utils');

const puppeteerOptions = {
	headless: false,
	defaultViewport: false,
	executablePath: getChromeExecutablePath(), // Avoid Bot detection
	userDataDir: getChromeProfilePath(), // Avoid Bot detection
	// userDataDir: './tmp', // Can avoid Captcha next launch as it will remember our actions
	args: ['--proxy-server=http://gate.nodemaven.com:8080'],
};
const urls = ['https://tiki.vn/search?q=android', 'https://tiki.vn/search?q=iphone'];

puppeteer.use(StealthPlugin());
puppeteer.launch(puppeteerOptions).then(async browser => {
	console.log('Running tests...');
	const page = await browser.newPage();
	await page.authenticate({ username: '', password: '' });

	await page.goto('http://httpbin.org/ip', { waitUntil: 'load' });
	const content = await page.$eval('body', el => {
		console.log(123);
		return el.innerText;
	});
	const ipMatch = content.match(/"origin":\s?"(\d{1,3}(?:\.\d{1,3}){3})"/);
	console.log(ipMatch ? `Proxy IP: ${ipMatch[1]}` : 'Proxy not found');

	await page.goto('https://bot.sannysoft.com', { waitUntil: 'load' });
	await page.waitForTimeout(5000);
	await page.screenshot({ path: 'bot-detection.png', fullPage: true });
	console.log('Check the screenshot for bot detection testing result');

	await browser.close();
	console.log('All done ✨');
});

(async () => {
	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_CONTEXT,
		maxConcurrency: 5,
		monitor: true,
		puppeteer,
		puppeteerOptions,
	});

	cluster.on('taskerror', (err, data) => {
		console.log(`Error crawling ${data}: ${err.message}`);
	});

	await cluster.task(async ({ page, data: { url, permissions } }) => {
		const context = page.browser().defaultBrowserContext();
		await context.overridePermissions(url, permissions);
		await page.goto(url, { waitUntil: 'load' });

		const products = [];
		const keyword = new URL(url).searchParams.get('q');
		const filename = `./data/${keyword}.csv`;
		let isBtnDisabled = false;

		fs.writeFile(filename, 'title,price,imgUrl\n', 'utf-8', err => {
			if (err) throw err;
			console.log('File created');
		});

		while (!isBtnDisabled) {
			await page.waitForSelector('.product-item', { visible: true, hidden: false });
			const productNodes = await page.$$('.product-item');

			for (const node of productNodes) {
				const [title, price, imgUrl] = await page.evaluate(el => {
					return [
						// Code inside page.evaluate runs in the context of the browser
						el.querySelector('.product-name')?.textContent.replace(',', ''),
						el.querySelector('.price-discount__price')?.textContent.slice(0, -1),
						el.querySelector('.product-image img')?.getAttribute('srcset').split(' ')[0],
					];
				}, node);

				if (title && price && imgUrl) {
					products.push({ title, price, imgUrl });
					fs.appendFile(filename, `${title},${price},${imgUrl}\n`, 'utf-8', err => {
						if (err) throw err;
						console.log(title);
					});
				}
			}

			isBtnDisabled = (await page.$('div:nth-child(3) a.arrow.disabled')) !== null;
			if (!isBtnDisabled)
				await Promise.all([
					page.click('div:nth-child(3) a.arrow'),
					page.waitForNavigation({ waitUntil: 'networkidle2' }),
				]);
		}
	});

	for (const url of urls) await cluster.queue({ url, permissions: [] });
	await cluster.idle();
	await cluster.close();
})();
