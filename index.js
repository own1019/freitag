const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const randomUserAgent = require('./randomUserAgent.js');
const { download } = require("./download");
puppeteer.use(pluginStealth());

module.exports = doPuppeteer = async () => {
	const debug = true;

	try {
		const browser = await puppeteer.launch({ headless: false, args: ['--proxy-server=socks5://127.0.0.1:9050'] }); //tor proxy setting
		const page = await browser.newPage();
		await page.setUserAgent(randomUserAgent()); //random user agent setting
		await page.setViewport({ width: 1366, height: 768 }); //full size screen open
		await page.goto('https://www.freitag.ch/en/f41?f%5B0%5D=neo_product_style%3A1045', {waitUntil: "networkidle2"});

		const color = await page.$$eval('#products-selector > ul > li', colors => colors.map(color => color.getAttribute('data-dimension17'))); //color data extraction
		const img = await page.$$eval('#products-selector > ul > li > a > img', imgs => imgs.map(img => img.getAttribute('src'))); //image url extraction
		const productId = await page.$$eval("#products-selector > ul > li", productIds => productIds.map(productId => productId.getAttribute("data-product-id")));
		
		console.log('li.length : ' + color.length);
		
		for (let i = 0; color.length > i; i++) {
			if (color[i].includes('1053') || color[i].includes('583') || color[i].includes('613') || color[i].includes('565') || color[i].includes('580') || color[i].includes('black')) { //민무늬 조건 shape[i].includes('plain')
				await download(img[i], './screenshot/freitag' + Math.random() + '.jpg');
				
				// console.log('쿠키 클릭');
				// await page.click('#accept-cookies-cta');

				// console.log('물품 클릭');
				// await page.screenshot({ path: 'screenshot/1.png', fullPage:true });
				// await page.click('a[href="/en/f41?productID='+productId[i]+'"]');
				// await page.waitFor(600);

				// console.log('장바구니 클릭');
				// await page.waitForSelector('button[data-product-id="'+productId[i]+'"]');
				// await page.click('button[data-product-id="'+productId[i]+'"]');

				// console.log('체크아웃 클릭');
				// await page.waitForSelector("#edit-checkout");
				// await page.evaluate(() => {
				// 	document.querySelector("#edit-checkout").click();
				// });

				// console.log('아이디 패스워드 입력 후 클릭');
				// await page.waitForNavigation();
				// await page.evaluate(() => {
				// 	document.querySelector('#edit-name').value = 'id';
				// 	document.querySelector('#edit-pass').value = 'pw';
				// });
				// await page.click('#edit-submit');

				// console.log('전화번호 입력 후 다음 단계 클릭');
				// await page.waitForNavigation();
				// await page.evaluate(() => {
				// 	document.querySelector('#edit-customer-profile-contact-neo-customer-phone-und-0-value').value = '01000001111';///////////////////////////////////////
				// });
				// await page.click('#edit-continue');

				// console.log('다음 클릭');
				// await page.waitForNavigation();
				// await page.click('#edit-continue');

				// console.log('동의 후 다음 클릭');
				// await page.waitForNavigation();
				// await page.click('#edit-terms-conditions > div > div > label');
				// await page.click('#edit-continue');

				// console.log('마스터카드 클릭');
				// await page.waitFor(18000);
				// await page.click('#payment-method > div > div > div.chooser--lists > div > div.chooser--content.js-segment.js-segment__display.js-segment__initted.js-segment__is-on > div > div.payment-list.payment-list__column > ul > li:nth-child(2) > a > img');

				// console.log('카드정보 입력 후 결제 클릭');
				// await page.waitFor(3000);
				// await page.evaluate(() => {
				// 	document.querySelector('#cardNumber').value = '1111222233334444';
				// 	document.querySelector('#expiry').value = '5566';
				// 	document.querySelector('#cvv').value = '789';
				// });
				// await page.click('#payLabel');
			}
		}

		await browser.close();
		console.log('-----------browser close----------');

	} catch (error) {
		console.log(error);
		console.log('-----------error close----------');
	}
};

