const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const randomUserAgent = require('./randomUserAgent.js');
const {download} = require("./download");
puppeteer.use(pluginStealth());
const cookies = require('./public/data/cookies.js');
const properties = require('./public/data/properties.json');
const telegramBot = require('./telegramBot.js');
const exec = require('child_process').exec;
const duplicateFakeCheck = require('./duplicateFakeCheck.js');

module.exports = doPuppeteer = async () => {
	const urls = ['https://www.freitag.ch/en/f41', 'https://www.freitag.ch/en/f11', 'https://www.freitag.ch/en/f05']
	const urlKinds = ['hawaii', 'lassie', 'blair']
	for (let j = 0; j < urls.length; j++) {
		const url = urls[j];
		const browser = await puppeteer.launch({ 
			headless: true,
			args: ['--proxy-server=socks5://127.0.0.1:9050'],
			ignoreHTTPSErrors : true
		});

		try {
			const page = await browser.newPage();

			//ip차단 시 tor ip 변경 로직
			page.on('response', response => {
				if (response.request().url() === url) {
					if (response.status() > 399) {
						console.log('response.status', response.status(), response.request().url());
						exec('(echo authenticate \'""\'; echo signal newnym; echo quit) | nc localhost 9051', (error, stdout, stderr) => {
							if(stdout.match(/250/g).length === 3) {
								console.log('Success: The IP Address has been changed.');
							} else {
								console.log('Error: A problem occured while attempting to change the IP Address.');
							}
						});
					} else {
						console.log('Success: The Page Response was successful (no need to change the IP Address).');
					}
				}
			});

			//이미지, 미디어, 폰트 로드 안하는 로직
			await page.setRequestInterception(true);
			await page.on('request', (req) => {
				if(req.resourceType() === 'image' || req.resourceType() === 'media' || req.resourceType() === 'font') {
					req.abort();
				} else {
					req.continue();
				}
			});

			await page.setUserAgent(randomUserAgent()); //random user agent setting
			await page.setCookie(...cookies.cookies); //freitag cookie setting
			await page.setViewport({ width: 1366, height: 1000 });
			await page.goto(`${url}`, {waitUntil: "networkidle2"});
				
			const color = await page.$$eval('#products-selector > ul > li', colors => colors.map(color => color.getAttribute('data-dimension17'))); //color data extraction
			const shape = await page.$$eval('#products-selector > ul > li', shapes => shapes.map(shape => shape.getAttribute('data-dimension18'))); //image url extraction
			const productId = await page.$$eval("#products-selector > ul > li", productIds => productIds.map(productId => productId.getAttribute("data-product-id")));
			const img = await page.$$eval('#products-selector > ul > li > a > img', imgs => imgs.map(img => img.getAttribute('src'))); //image url extraction
				
			//const productShowHide = await page.$eval('#products-load-all', el => el.getAttribute('style'));
			//console.log(productShowHide);
			// if(productShowHide == null) {
			// 	console.log('모두안보기');
			// } else {
			// 	console.log('모두보기');
			// }

			console.log(urlKinds[j] + ' / ' + color.length);

			for(let i = 0; color.length > i; i++) {
				if(shape[i].includes('plain')) {
					if(color[i].includes('industrial') || color[i].includes('pink') || color[i].includes('olive') || color[i].includes('1053') || color[i].includes('583') || color[i].includes('613') || color[i].includes('565') || color[i].includes('580') || color[i].includes('black')) {
						let duplicateFakeCheck = await duplicateFakeCheck(productId[i]); //뻥스탁일 경우 false, 아닐경우 true 리턴
						if(duplicateFakeCheck) {
							await download(img[i], './public/images/screenshot/freitag' + Math.random() + '.jpg');
							await telegramBot(img[i]);
						}
						
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

						// console.log('결제완료!');
						// //await page.waitFor(100000);
					}
				}
			}
			await page.close();
		} catch (error) {
			console.log(error);
			console.log('-----------error----------');
		}
		await browser.close();
		console.log('-----------browser close----------');
	}
};
