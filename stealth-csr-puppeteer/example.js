require('dotenv').config();
const { scrapeWithPagination, clusterWrapper } = require('puppeteer-ecommerce-scraper');

async function extractShopee(page, queueData) {
	const { products } = await scrapeWithPagination({
		page, // Puppeteer page object
		scrollConfig: { scrollDelay: 500, scrollStep: 500, numOfScroll: 2, direction: 'both' },
		scrapingConfig: {
			url: `https://shopee.vn/search?keyword=${queueData}`,
			productSelector: '.shopee-search-item-result__item',
			filePath: `./data/shopee-${queueData}.csv`,
			fileHeader: 'title,price,imgUrl\n',
		},
		paginationConfig: {
			nextPageSelector: '.shopee-icon-button--right',
			disabledSelector: '.shopee-icon-button--right .shopee-icon-button--disabled',
			sleep: 1000, // in milliseconds
			maxPages: 3, // 0 for unlimited
		},
		extractFunc: async productDOM => {
			const title = productDOM.querySelector('div[data-sqe="name"] > div:nth-child(1) > div')?.textContent;
			const priceParent = productDOM.querySelector('span[aria-label="current price"]')?.parentElement;
			const price = priceParent?.querySelectorAll('span')[2]?.textContent;
			const imgUrl = productDOM.querySelector('img[style="object-fit: contain"]')?.getAttribute('src');
			return [title?.replaceAll(',', '_'), price, imgUrl];
		},
	});
	console.log(`[DONE] Fetched ${products.length} ${queueData} products from Shopee`);
}

(async () => {
	await clusterWrapper({
		func: extractShopee,
		queueEntries: ['android', 'iphone'],
		proxyEndpoint: process.env.PROXY_ENDPOINT, // Must be in the form of http://username:password@host:port
		monitor: false,
		useProfile: false, // After solving Captcha, save your profile, so you may avoid doing it next time
	});
})();
