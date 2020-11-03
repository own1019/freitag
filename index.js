const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const fs = require('fs');
const https = require('https');
puppeteer.use(pluginStealth())

function download(url, destination) {
	return new Promise((resolve, reject) => {
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
}

module.exports = doPuppeteer = async() => {
	const SimpleNodeLogger = require('simple-node-logger'),
	opts = {
		logFilePath: 'logs/' + 'bot.log',
		timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
	};
	log = SimpleNodeLogger.createSimpleFileLogger( opts );
	log.setLevel('info');
	const debug = true;
	let color = '';
	let img = '';

	try {
		const browser = await puppeteer.launch({
			ignoreHTTPSErrors: true,
			headless : false
		});

		const page = await browser.newPage();
		
		const waitTillHTMLRendered = async (page, timeout = 30000) => {
			const checkDurationMsecs = 1000;
			const maxChecks = timeout / checkDurationMsecs;
			let lastHTMLSize = 0;
			let checkCounts = 1;
			let countStableSizeIterations = 0;
			const minStableSizeIterations = 3;
		  
			while(checkCounts++ <= maxChecks) {
				let html = await page.content();
				let currentHTMLSize = html.length; 
				let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
				
				//console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
		  
				if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
					countStableSizeIterations++;
				else 
					countStableSizeIterations = 0; //reset the counter
				if(countStableSizeIterations >= minStableSizeIterations) {
					//console.log("Page rendered fully..");
					break;
				}
				lastHTMLSize = currentHTMLSize;
				await page.waitFor(checkDurationMsecs);
			}  
		};

		await page.goto('https://www.freitag.ch/ko/f41?f%5B0%5D=neo_product_style%3A1045', {'timeout': 10000, 'waitUntil':'load'});
		await waitTillHTMLRendered(page)
		
		// #### LOG / DEBUG
		if(debug == true) {
			log.info('1. get color data');
			color = await page.$$eval('#products-selector > ul > li', colors => colors.map(color => color.getAttribute('data-dimension17')));
			//console.log(color);
		}
		//#### LOG / DEBUG END
		
		// #### LOG / DEBUG
		if(debug == true) {
			log.info('2. get image data');
			img = await page.$$eval('#products-selector > ul > li > a > img', imgs => imgs.map(img => img.getAttribute('src')));
			//console.log(img);
		}
		//#### LOG / DEBUG END

		console.log('li.length : ' + color.length);

		// #### LOG / DEBUG
		if(debug == true) {
		log.info('3. image Download');
			for(let i=0; color.length > i; i++) {
				if(color[i].includes('1053') || color[i].includes('583') || color[i].includes('613') || color[i].includes('565') || color[i].includes('580') || color[i].includes('black'))  { //민무늬 조건 제거 && shape[i].includes('plain')
					console.log(color[i]);
					console.log(img[i]);
					await download(img[i], './screenshot/freitag' + Math.random() + '.jpg');
				}
			}
		}
		//#### LOG / DEBUG END

		// #### LOG / DEBUG
		if(debug == true) {
			log.info('4. browser close');
			await page.waitFor(5000);
			console.log('-----------browser close----------');
			log.info('---------------------------------------------');
			await browser.close();
		}
		//#### LOG / DEBUG END
	 } catch (error) {
	 	console.log(error);
	}
};
//doPuppeteer();

