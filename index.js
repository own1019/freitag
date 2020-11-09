const { telegramBot } = require('./telegramBot');
const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const randomUserAgent = require('./randomUserAgent.js');
const { download } = require("./download");
puppeteer.use(pluginStealth());
const cookies = require('./public/data/cookies.js');
const properties = require('./public/data/properties.json');

module.exports = doPuppeteer = async () => {
		const browser = await puppeteer.launch({ 
			headless: false,
			args: ['--proxy-server=socks5://127.0.0.1:9050'] 
		});
		try {
			const page = await browser.newPage();
			await page.setUserAgent(randomUserAgent()); //random user agent setting
			await page.setCookie(...cookies.cookies); //freitag cookie setting
			await page.setViewport({ width: 1366, height: 1000 }); //full size screen open
			await page.setRequestInterception(true);

			page.on('request', (req) => {
				if(req.resourceType() === 'image' || req.resourceType() === 'media'){
					req.abort();
				}
				else {
					req.continue();
				}
			});

			await page.goto('https://www.freitag.ch/en/f41?f%5B0%5D=neo_product_style%3A1045', {waitUntil: "networkidle2"});
			//await page.goto('https://www.freitag.ch/ko/f201', {waitUntil: "networkidle2"}); //모두보기 테스트용
			
			
			const color = await page.$$eval('#products-selector > ul > li', colors => colors.map(color => color.getAttribute('data-dimension17'))); //color data extraction
			const img = await page.$$eval('#products-selector > ul > li > a > img', imgs => imgs.map(img => img.getAttribute('src'))); //image url extraction
			//const productShowHide = await page.$eval('#products-load-all', el => el.getAttribute('style'));
			//const productId = await page.$$eval("#products-selector > ul > li", productIds => productIds.map(productId => productId.getAttribute("data-product-id")));

			//console.log(productShowHide);
			// if(productShowHide == null) {
			// 	console.log('모두안보기');
			// } else {
			// 	console.log('모두보기');
			// }

			console.log('li.length : ' + color.length);

			

			for(let i = 0; color.length > i; i++) {
				if (color[i].includes('1053') || color[i].includes('583') || color[i].includes('613') || color[i].includes('565') || color[i].includes('580') || color[i].includes('black')) { //민무늬 조건 shape[i].includes('plain')
					await download(img[i], './public/images/screenshot/freitag' + Math.random() + '.jpg');
					await telegramBot(img[i]);

					// //이부분을 숨겨진 물품 상세를 바로 보이게 변경해서 빠르게 클릭하기
					// await page.click('a[href="/en/f41?productID='+productId[i]+'"]');
					// console.log('물품 클릭');
					// await page.waitFor(1000);

					// await page.waitForSelector('button[data-product-id="'+productId[i]+'"]');
					// await page.click('button[data-product-id="'+productId[i]+'"]');
					// console.log('장바구니 클릭');

					// await page.waitForSelector("#edit-checkout");
					// await page.evaluate(() => {
					// 	document.querySelector("#edit-checkout").click();
					// });
					// console.log('체크아웃 클릭');
					
					// await page.waitForNavigation();
					// await page.evaluate((id, pw) => {
					// 	document.querySelector('#edit-name').value = id;
					// 	document.querySelector('#edit-pass').value = pw;
					// }, properties[0].id, properties[0].pw);
					// await page.click('#edit-submit');
					// console.log('아이디 패스워드 입력 후 클릭');
					
					// await page.waitForNavigation();
					// await page.evaluate((phone) => {
					// 	document.querySelector('#edit-customer-profile-contact-neo-customer-phone-und-0-value').value = phone;
					// }, properties[0].phone);
					// await page.click('#edit-continue');
					// console.log('전화번호 입력 후 다음 단계 클릭');

					// await page.waitForNavigation();
					// //await page.waitFor(3000);
					// await page.click('#edit-continue');
					// console.log('다음 클릭');
					
					// await page.waitForNavigation();
					// await page.click('#edit-terms-conditions > div > div > label');
					// await page.click('#edit-continue');
					// console.log('동의 후 다음 클릭');
					
					// await page.waitFor(18000);
					// await page.click('#payment-method > div > div > div.chooser--lists > div > div.chooser--content.js-segment.js-segment__display.js-segment__initted.js-segment__is-on > div > div.payment-list.payment-list__column > ul > li:nth-child(2) > a > img');
					// console.log('마스터카드 클릭');

					// await page.waitFor(3000);
					// await page.evaluate((cardNumber, expiry, cvv) => {
					// 	document.querySelector('#cardNumber').value = cardNumber;
					// 	document.querySelector('#expiry').value = expiry;
					// 	document.querySelector('#cvv').value = cvv;
					// }, properties[0].cardNumber,  properties[0].expiry, properties[0].cvv);
					// await page.click('#payLabel');
					// console.log('카드정보 입력 후 결제 클릭');
					// //await page.waitFor(100000);
				}
			}
		} catch (error) {
			console.log(error);
			console.log('-----------error----------');
		}
	await browser.close();
	console.log('-----------browser close----------');
};
