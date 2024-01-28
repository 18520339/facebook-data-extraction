const fs = require('fs');
const os = require('os');

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
	const isFileExists = path => {
		try {
			fs.accessSync(path, fs.constants.F_OK);
			return true;
		} catch (e) {
			return false;
		}
	};

	switch (os.platform()) {
		case 'win32': // Windows
			const paths = [
				'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
				'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
			];
			for (let path of paths) if (isFileExists(path)) return path;
			throw new Error('Chrome executable not found in expected locations on Windows');
		case 'darwin': // macOS
			return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
		case 'linux': // Linux
			return '/usr/bin/google-chrome';
		default:
			throw new Error('Unsupported platform');
	}
}

module.exports = { getChromeProfilePath, getChromeExecutablePath };
