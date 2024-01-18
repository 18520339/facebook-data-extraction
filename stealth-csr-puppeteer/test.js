const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getChromeProfilePath, getChromeExecutablePath } = require('./utils');

const puppeteerOptions = {
	headless: false,
	defaultViewport: false,
	executablePath: getChromeExecutablePath(), // Avoid Bot detection
	userDataDir: getChromeProfilePath(), // Avoid Bot detection
	// userDataDir: './tmp', // Can avoid Captcha next launch as it will remember our actions
	args: ['--proxy-server=http://gate.nodemaven.com:8080'],
};

puppeteer.use(StealthPlugin());
puppeteer.launch(puppeteerOptions).then(async browser => {
	console.log('Running tests...');
	const page = await browser.newPage();
	await page.authenticate({ username: '', password: '' });

	await page.goto('http://httpbin.org/ip', { waitUntil: 'networkidle2' });
	const content = await page.$eval('body', el => el.innerText);
	const ipMatch = content.match(/"origin":\s?"(\d{1,3}(?:\.\d{1,3}){3})"/);
	console.log(ipMatch ? `Current IP: ${ipMatch[1]}` : 'Proxy not found');

	await page.goto('https://bot.sannysoft.com', { waitUntil: 'networkidle2' });
	await page.waitForTimeout(5000);
	await page.screenshot({ path: 'bot-detection.png', fullPage: true });
	console.log('Check the screenshot for bot detection testing result');

	await browser.close();
	console.log('All done ✨');
});
