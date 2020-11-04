const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const randomUserAgent = require('./randomUserAgent.js');
const { download } = require("./download");
puppeteer.use(pluginStealth());

module.exports = doPuppeteer = async () => {
	const debug = true;
	let color = '';
	let img = '';

	try {
		const browser = await puppeteer.launch({ headless: true, args: ['--proxy-server=socks5://127.0.0.1:9050'] }); //tor proxy setting
		const page = await browser.newPage();
		await page.setUserAgent(randomUserAgent()); //random user agent setting
		await page.setViewport({ width: 1366, height: 768 }); //full size screen open
		await page.goto('https://www.freitag.ch/en/f41?f%5B0%5D=neo_product_style%3A1045', { waitUntil: "networkidle2" });

		await page.click('#accept-cookies-cta');

		color = await page.$$eval('#products-selector > ul > li', colors => colors.map(color => color.getAttribute('data-dimension17'))); //color data extraction
		img = await page.$$eval('#products-selector > ul > li > a > img', imgs => imgs.map(img => img.getAttribute('src'))); //image url extraction

		console.log('li.length : ' + color.length);
		
		for (let i = 0; color.length > i; i++) {
			if (color[i].includes('1053') || color[i].includes('583') || color[i].includes('613') || color[i].includes('565') || color[i].includes('580') || color[i].includes('black')) { //민무늬 조건 제거 && shape[i].includes('plain')
				await download(img[i], './screenshot/freitag' + Math.random() + '.jpg');
			}
		}

		await browser.close();
		console.log('-----------browser close----------');

	} catch (error) {
		console.log(error);
		await browser.close();
		console.log('-----------timeout browser close----------');
	}
};

