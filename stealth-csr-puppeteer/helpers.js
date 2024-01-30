const fs = require('fs');
const os = require('os');

function isFileExists(installedPath) {
	try {
		fs.accessSync(installedPath, fs.constants.F_OK);
		return true;
	} catch (e) {
		return false;
	}
}

// Cannot use the same profile for multiple browsers => Not working with CONCURRENCY_BROWSER
function getChromeProfilePath() {
	const homePath = os.homedir();
	switch (os.platform()) {
		case 'win32': // Windows
			return `${homePath}\\AppData\\Local\\Google\\Chrome\\User Data\\Default`;
		case 'darwin': // macOS
			return `${homePath}/Library/Application Support/Google/Chrome/Default`;
		case 'linux': // Linux
			return `${homePath}/.config/google-chrome/Default`;
		default:
			throw new Error('Unsupported platform');
	}
}

function getChromeExecutablePath() {
	switch (os.platform()) {
		case 'win32': // Windows
			for (let installedPath of [
				'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
				'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
			])
				if (isFileExists(installedPath)) return installedPath;
			throw new Error('Chrome executable not found in expected locations on Windows');
		case 'darwin': // macOS
			return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
		case 'linux': // Linux
			return '/usr/bin/google-chrome';
		default:
			throw new Error('Unsupported platform');
	}
}

async function loadNotBlankPage(page, url, proxyUsername = '', proxyPassword = '') {
	const browser = page.browser();
	const context = browser.defaultBrowserContext();
	await context.overridePermissions(url, []);

	const pagesArray = await browser.pages();
	const notBlankPage = pagesArray[0];
	await page.close(pagesArray[1]);

	if (proxyUsername && proxyPassword)
		await notBlankPage.authenticate({ username: proxyUsername, password: proxyPassword });
	await notBlankPage.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
	return notBlankPage;
}

module.exports = { isFileExists, getChromeProfilePath, getChromeExecutablePath, loadNotBlankPage };
