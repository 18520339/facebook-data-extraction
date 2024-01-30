require('dotenv').config();
const { clusterWrapper } = require('./wrapper');
const { scrapeWithPagination } = require('./scraper');

async function extractLazada(page, queueData) {
	const { products } = await scrapeWithPagination({
		page, // Puppeteer page object
		scrollConfig: { scrollDelay: 500, scrollStep: 500, numOfScroll: 2, direction: 'both' },
		scrapingConfig: {
			url: `https://www.lazada.vn/catalog/?q=${queueData}`,
			productSelector: '[data-qa-locator="product-item"]',
			filePath: `./data/lazada-${queueData}.csv`,
			fileHeader: 'title,price,imgUrl\n',
		},
		paginationConfig: {
			nextPageSelector: '.ant-pagination-next button',
			disabledSelector: '.ant-pagination-next button[disabled]',
			sleep: 1000, // in milliseconds
			maxPages: 3, // 0 for unlimited
		},
		extractFunc: async productDOM => {
			const parent = '[data-qa-locator="product-item"] > div > div';
			const imgUrl = productDOM.querySelector(`${parent} img[type="product"]`)?.getAttribute('src').split('_')[0];
			return [
				productDOM.querySelector(`${parent} > div:nth-child(2) a`)?.textContent.replaceAll(',', ''),
				productDOM
					.querySelector(`${parent} > div:nth-child(2) > div:nth-child(3) > span`)
					?.textContent.replaceAll('₫', ''),
				imgUrl.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/) ? imgUrl : '',
			];
		},
	});
	console.log(`[DONE] Fetched ${products.length} ${queueData} products from Lazada`);
}

(async () => {
	await clusterWrapper({
		func: extractLazada,
		queueEntries: ['android', 'iphone'],
		proxyEndpoint: process.env.PROXY_ENDPOINT, // Must be in the form of http://username:password@host:port
		monitor: false,
		useProfile: true, // After solving Captcha, save uour profile, so you may avoid doing it next time
	});
})();
