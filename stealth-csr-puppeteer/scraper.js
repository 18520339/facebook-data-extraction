const path = require('path');
const fs = require('fs');

async function scrapeWithPagination({
	page, // Puppeteer page object
	extractFunc, // Function to extract product info from product DOM
	scrapingConfig = { url: '', productSelector: '', filePath: '', fileHeader: '' },
	paginationConfig = { nextPageSelector: '', disabledSelector: '', sleep: 1000, maxPages: 0 },
	scrollConfig = { scrollDelay: NaN, scrollStep: NaN, numOfScroll: 1, direction: 'both' },
}) {
	const { url, productSelector } = scrapingConfig;
	const products = [];
	let totalPages = 1;
	let notLastPage = !!productSelector;

	if (!scrapingConfig.filePath) {
		const domainAndAfter = url.split('.').slice(1).join('_');
		scrapingConfig.filePath = './data/' + domainAndAfter.replace(/[^a-zA-Z0-9]/g, '_');
	}
	createFile(scrapingConfig.filePath, scrapingConfig.fileHeader);
	await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

	while (notLastPage && (paginationConfig.maxPages === 0 || totalPages <= paginationConfig.maxPages)) {
		await page.waitForSelector(productSelector, { visible: true, hidden: false, timeout: 0 });

		const { scrollDelay, scrollStep, numOfScroll, direction } = scrollConfig;
		if (scrollDelay && scrollStep && numOfScroll > 0) {
			await page.evaluate(autoScroll.toString());
			const actionsInBrowser = // scroll for fully rendering
				direction == 'both'
					? `autoScroll(${scrollDelay}, ${scrollStep}, 'bottom').then(() => autoScroll(${scrollDelay}, ${scrollStep}, 'top'))`
					: `autoScroll(${scrollDelay}, ${scrollStep}, '${direction}')`;
			for (let i = 0; i < numOfScroll; i++) await page.evaluate(actionsInBrowser);
		}

		const productNodes = await page.$$(productSelector);
		for (const node of productNodes) {
			// Code inside `evaluate` runs in the context of the browser
			const productInfo = await page.evaluate(extractFunc, node);
			saveProduct(products, productInfo, scrapingConfig.filePath);
		}

		console.log(
			`${scrapingConfig.filePath}\t`,
			`| Total products now: ${products.length}\t`,
			`| Page: ${totalPages}/${paginationConfig.maxPages || '\u221E'}\t`,
			`| URL: ${url}`
		);
		notLastPage = await navigatePage({ page, ...paginationConfig });
		totalPages += notLastPage;
	}
	return { products, totalPages, scrapingConfig, paginationConfig, scrollConfig };
}

function autoScroll(delay, scrollStep, direction) {
	return new Promise((resolve, reject) => {
		if (direction === 'bottom') window.scrollTo({ top: 0, behavior: 'smooth' });
		else {
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
			scrollStep = -scrollStep;
		}
		console.log('Loading items by scrolling to', direction);

		const scrollId = setInterval(() => {
			let currentHeight = window.scrollY;
			if (
				(direction === 'bottom' && currentHeight + window.innerHeight < document.body.scrollHeight) ||
				(direction === 'top' && currentHeight > 0)
			)
				window.scrollBy(0, scrollStep);
			else {
				clearInterval(scrollId);
				resolve();
			}
		}, delay);
	});
}

function createFile(filePath, header = '') {
	const dir = path.dirname(filePath);
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFile(filePath, header, 'utf-8', err => {
		if (err) throw err;
		console.log(`${filePath} created`);
	});
}

function saveProduct(products, productInfo, filePath) {
	if (!productInfo.some(value => !value)) {
		products.push(productInfo);
		fs.appendFile(filePath, productInfo + '\n', 'utf-8', err => {
			if (err) throw err;
			// console.log(productInfo.toString());
		});
	} else console.log(`Cannot write to ${filePath} as this item has empty value:`, productInfo);
}

async function navigatePage({ page, nextPageSelector, disabledSelector, sleep = 1000 }) {
	if (!(nextPageSelector && disabledSelector)) return false;
	const notLastPage = (await page.$(disabledSelector)) === null;

	// https://github.com/puppeteer/puppeteer/issues/1412#issuecomment-402725036
	// const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });
	// if (notLastPage) {
	// 	await page.click(nextPageSelector);
	// 	await navigationPromise;
	// }

	if (notLastPage)
		await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 }), page.click(nextPageSelector)]);
	await new Promise(resolve => setTimeout(resolve, sleep));
	return notLastPage;
}

module.exports = { scrapeWithPagination, autoScroll, createFile, saveProduct, navigatePage };
