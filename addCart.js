const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const fs = require('fs');
const https = require('https');
puppeteer.use(pluginStealth())

const download = (url, destination) => new Promise((resolve, reject) => {
	const file = fs.createWriteStream(destination);
	https.get(url, response => {
		response.pipe(file);
		file.on('finish', () => {
		file.close(resolve(true));
		});
	}).on('error', error => {
		fs.unlink(destination);
		reject(error.message);
	});
});

module.exports = doPuppeteer = async() => {
	const SimpleNodeLogger = require('simple-node-logger'),
	opts = {
		logFilePath: 'logs/' + 'bot2.log',
		timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
	};
	log = SimpleNodeLogger.createSimpleFileLogger( opts );
	log.setLevel('info');
	const debug = true;
	let color = '';
	let img = '';
	let productId = '';

	try {
	const browser = await puppeteer.launch({
		ignoreHTTPSErrors: true,
		headless : false
		
	});

	

		const page = await browser.newPage();

		

		await page.setViewport({
			width : 1920               // 페이지 너비
		  , height : 1080                // 페이지 높이
	  });

		await page.goto('https://www.freitag.ch/ko/f41?f%5B0%5D=neo_product_style%3A1045');
		

		// #### LOG / DEBUG
		if(debug == true) {
			log.info('1. get color data');
			color = await page.$$eval('#products-selector > ul > li', colors => colors.map(color => color.getAttribute('data-dimension17')));
		}
		//#### LOG / DEBUG END
		
		// #### LOG / DEBUG
		if(debug == true) {
			log.info('2. get image data');
			img = await page.$$eval('#products-selector > ul > li > a > img', imgs => imgs.map(img => img.getAttribute('src')));
		}
		//#### LOG / DEBUG END

		// #### LOG / DEBUG
		if(debug == true) {
			log.info('3. get product-id data');
			productId = await page.$$eval("#products-selector > ul > li", productIds => productIds.map(productId => productId.getAttribute("data-product-id")));
		}
		//#### LOG / DEBUG END

		// #### LOG / DEBUG
		if(debug == true) {
			log.info('4. product buying process START');
			for(let i=0; color.length > i; i++) {
				if(color[i].includes('1053') || color[i].includes('583') || color[i].includes('613') || color[i].includes('565') || color[i].includes('580') || color[i].includes('blue'))  { //민무늬 조건 제거
					// #### LOG / DEBUG
					if(debug == true) {
					 	log.info('5. cookie window click');
					 	await page.click('#accept-cookies-cta');
					}
					//#### LOG / DEBUG END

					// #### LOG / DEBUG
					if(debug == true) {
						log.info('6. product click');
						await page.screenshot({ path: 'screenshot/2.png', fullPage:true });
						await page.click('a[href="/ko/f41?productID='+productId[i]+'"]');
						await page.waitFor(600);
					}
					//#### LOG / DEBUG END

					// #### LOG / DEBUG
					if(debug == true) {
						log.info('7. cart click');
						await page.screenshot({ path: 'screenshot/3.png', fullPage:true });
						await page.waitForSelector('button[data-product-id="'+productId[i]+'"]');
						await page.click('button[data-product-id="'+productId[i]+'"]');
					}
					//#### LOG / DEBUG END

					// #### LOG / DEBUG
					if(debug == true) {
						log.info('8. checkout click');
						await page.screenshot({ path: 'screenshot/4.png', fullPage:true });
						await page.waitForSelector("#edit-checkout");
						await page.evaluate(() => {
							document.querySelector("#edit-checkout").click();
						});
					}
					//#### LOG / DEBUG END

					// #### LOG / DEBUG
					if(debug == true) {
						log.info('9. login');
						await page.waitForNavigation();
						await page.evaluate(() => {
							document.querySelector('#edit-name').value = 'id';
							document.querySelector('#edit-pass').value = 'pw!';
						});
						await page.click('#edit-submit');
					}
					//#### LOG / DEBUG END

					// #### LOG / DEBUG
					if(debug == true) {
						log.info('10. input phoneNumber');
						await page.waitForNavigation();
						await page.evaluate(() => {
							document.querySelector('#edit-customer-profile-contact-neo-customer-phone-und-0-value').value = '01000001111';///////////////////////////////////////
						});
						await page.click('#edit-continue');
					}
					//#### LOG / DEBUG END

					// #### LOG / DEBUG
					if(debug == true) {
						log.info('11. next');
						await page.waitForNavigation();
						await page.click('#edit-continue');
					}

					// #### LOG / DEBUG
					if(debug == true) {
						log.info('12. term check and next');
						await page.waitForNavigation();
						await page.click('#edit-terms-conditions > div > div > label');
						await page.click('#edit-continue');
					}
					//#### LOG / DEBUG END

					// #### LOG / DEBUG
					if(debug == true) {
						log.info('13. payment-method click - mastercard');
						await page.waitFor(10000);
						await page.click('#payment-method > div > div > div.chooser--lists > div > div.chooser--content.js-segment.js-segment__display.js-segment__initted.js-segment__is-on > div > div.payment-list.payment-list__column > ul > li:nth-child(2) > a > img');
					}
					//#### LOG / DEBUG END


					// #### LOG / DEBUG
					if(debug == true) {
						log.info('14. card info input');
						await page.waitFor(3000);
						await page.evaluate(() => {
							document.querySelector('#cardNumber').value = '1111222233334444';
							document.querySelector('#expiry').value = '5566';
							document.querySelector('#cvv').value = '789';
						});
						await page.click('#payLabel');
					}
					//#### LOG / DEBUG END
					
					// #### LOG / DEBUG
					if(debug == true) {
						log.info('15. product image download');
						await download(img[i], './screenshot/freitag' + Math.random() + '.jpg');
					}
					//#### LOG / DEBUG END
					//doPuppeteer();
				}
			}
		}
		//#### LOG / DEBUG END
	} catch (error) {
		console.log('에러입니다 : ' + error);
	}
};
doPuppeteer();


