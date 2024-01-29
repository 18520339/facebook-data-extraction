require('dotenv').config();
const { PROXY_SERVER, PROXY_USERNAME, PROXY_PASSWORD } = process.env;

const { Cluster } = require('puppeteer-cluster');
const { getChromeExecutablePath } = require('./utils');
const puppeteerOptions = {
	headless: false,
	defaultViewport: false,
	executablePath: getChromeExecutablePath(), // Avoid Bot detection
	args: [`--proxy-server=${PROXY_SERVER}`],
};

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const maxConcurrency = 2;

(async () => {
	const cluster = await Cluster.launch({
		concurrency: Cluster.CONCURRENCY_BROWSER,
		maxConcurrency,
		puppeteer,
		perBrowserOptions: Array.from({ length: maxConcurrency }, (_, i) => ({
			...puppeteerOptions,
			userDataDir: `./tmp/profile${i}`, // For each browser, use a different profile
		})),
	});

	cluster.on('taskerror', (err, data) => {
		console.log(`Error crawling ${data}: ${err.message}`);
	});

	await cluster.task(async ({ page, data: queueIndex }) => {
		console.log(`Running tests for queue ${queueIndex}...`);
		if (PROXY_USERNAME && PROXY_PASSWORD)
			await page.authenticate({ username: PROXY_USERNAME, password: PROXY_PASSWORD });

		await page.goto('https://ipinfo.io/json', { waitUntil: 'domcontentloaded' });
		const content = await page.$eval('body', el => el.innerText);
		console.log(`IP Information of Queue ${queueIndex}: ${content}`);

		await page.goto('https://bot.sannysoft.com', { waitUntil: 'networkidle2' });
		const ssPath = `./tmp/bot${queueIndex}.png`;
		await page.screenshot({ path: ssPath, fullPage: true });
		console.log(`Check ${ssPath} for anti-bot testing result of Queue ${queueIndex}`);
	});

	for (let i = 0; i < maxConcurrency; i++) await cluster.queue(i);
	await cluster.idle();
	await cluster.close();
	console.log('All done ✨');
})();
