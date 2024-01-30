require('dotenv').config();
const { clusterWrapper } = require('./wrapper');

function getWebName(url) {
	const parsedUrl = new URL(url);
	const hostnameParts = parsedUrl.hostname.split('.');
	return hostnameParts[hostnameParts.length - 1].length === 2
		? hostnameParts[hostnameParts.length - 3]
		: hostnameParts[hostnameParts.length - 2];
}

function url2FileName(url) {
	const parsedUrl = new URL(url);
	const fileName = parsedUrl.hostname.replace(/^www\./, '') + parsedUrl.pathname + parsedUrl.search;
	return fileName.replace(/[^a-zA-Z0-9]/g, '_');
}

(async () => {
	await clusterWrapper({
		func: async (page, queueData) => {
			const webName = url2FileName(queueData);
			await page.goto(queueData, { waitUntil: 'networkidle2' });
			await page.screenshot({ path: `./tmp/${webName}.png`, fullPage: true });
			console.log(`Check ./tmp/${webName}.png for anti-bot testing result on ${queueData}`);
		},
		queueEntries: [
			'https://bot.sannysoft.com',
			'https://browserleaks.com/webrtc',
			'https://browserleaks.com/javascript',
		],
		proxyEndpoint: process.env.PROXY_ENDPOINT, // Must be in the form of http://username:password@host:port
		monitor: false,
		useProfile: true, // After solving Captcha, save uour profile, so you may avoid doing it next time
	});
})();
