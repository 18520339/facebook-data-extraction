require('dotenv').config();
const { PROXY_SERVER, PROXY_USERNAME, PROXY_PASSWORD } = process.env;
const fs = require('fs');

const { Cluster } = require('puppeteer-cluster');
const { getChromeExecutablePath, sleep } = require('./utils');
const puppeteerOptions = {
	headless: false,
	defaultViewport: false,
	executablePath: getChromeExecutablePath(), // Avoid Bot detection
	args: [`--proxy-server=${PROXY_SERVER}`],
};

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const urls = ['https://tiki.vn/search?q=android', 'https://tiki.vn/search?q=iphone'];
const maxConcurrency = Math.min(urls.length, 5);

(async () => {
	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_BROWSER,
		maxConcurrency,
		puppeteer,
		perBrowserOptions: Array.from({ length: maxConcurrency }, (_, i) => ({
			...puppeteerOptions,
			// userDataDir: `./tmp/profile${i}`, // For each browser, use a different profile
		})),
		monitor: true,
		timeout: 1e5,
	});

	cluster.on('taskerror', (err, data) => {
		console.log(err.message, JSON.stringify(data));
	});

	await cluster.task(async ({ page, data: { url, permissions } }) => {
		const browser = page.browser();
		const context = browser.defaultBrowserContext();
		await context.overridePermissions(url, permissions);

		const pagesArray = await browser.pages();
		const notBlankPage = pagesArray[0];
		await page.close(pagesArray[1]);

		if (PROXY_USERNAME && PROXY_PASSWORD)
			await notBlankPage.authenticate({ username: PROXY_USERNAME, password: PROXY_PASSWORD });
		await notBlankPage.goto(url, { waitUntil: 'load' });

		const products = [];
		const keyword = new URL(url).searchParams.get('q');
		const filename = `./data/${keyword}.csv`;
		let isBtnDisabled = false;

		fs.writeFile(filename, 'title,price,imgUrl\n', 'utf-8', err => {
			if (err) throw err;
			console.log(`${filename} created`);
		});

		while (!isBtnDisabled) {
			await notBlankPage.waitForSelector('.product-item', { visible: true, hidden: false });
			const productNodes = await notBlankPage.$$('.product-item');

			for (const node of productNodes) {
				const [title, price, imgUrl] = await notBlankPage.evaluate(el => {
					return [
						// Code inside `evaluate` runs in the context of the browser
						el.querySelector('.product-name')?.textContent.replaceAll(',', ''),
						el.querySelector('.price-discount__price')?.textContent.slice(0, -1),
						el.querySelector('.product-image img')?.getAttribute('srcset').split(' ')[0],
					];
				}, node);

				if (title && price && imgUrl) {
					products.push({ title, price, imgUrl });
					fs.appendFile(filename, `${title},${price},${imgUrl}\n`, 'utf-8', err => {
						if (err) throw err;
						// console.log(title);
					});
				}
			}

			isBtnDisabled = (await notBlankPage.$('div:nth-child(3) a.arrow.disabled')) !== null;
			if (!isBtnDisabled)
				await Promise.all([
					notBlankPage.click('div:nth-child(3) a.arrow'),
					notBlankPage.waitForNavigation({ waitUntil: 'domcontentloaded' }),
					sleep(1000),
				]);
		}
	});

	for (const url of urls) await cluster.queue({ url, permissions: [] });
	await cluster.idle();
	await cluster.close();
})();
