const puppeteer = require("puppeteer");
const fs = require('fs');
const request = require('request');
const https = require('https');
const schedule = require('node-schedule');

	let job = schedule.scheduleJob('15 * * * * *', function(){
		let mNow = new Date();
		console.log('excute time : ' + mNow);
		doPuppeteer();
	});

	const doPuppeteer = async() => {
		const browser = await puppeteer.launch({
			//executablePath : "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
			headless : true
		});

		const userAgentList = new Array(
		'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148 Safari/604.1'
		,'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
		,'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1'
		,'Mozilla/5.0 (iPhone; CPU iPhone OS 13_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1'
		,'Mozilla/5.0 CK={} (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
		,'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)'
		,'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-J737T) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.2 Chrome/71.0.3578.99 Mobile Safari/537.36'
		,'Mozilla/5.0 (Linux; Android 6.0; LG-K430 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.126 Mobile Safari/537.36'
		,'Mozilla/5.0 (Linux; Android 9; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.116 Mobile Safari/537.36'
		,'Mozilla/5.0 (Linux; Android 5.1; XT1033 Build/LPBS23.13-56-2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36'
		,'Mozilla/5.0 (Linux; Android 8.1.0; LML212VL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.93 Mobile Safari/537.36'
		,'Mozilla/5.0 (Linux; Android 6.0; LG-K430 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36'
		,'Mozilla/5.0 (Linux; Android 9; 5032W) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.136 Mobile Safari/537.36'
		,'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1'
		,'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148 Safari/604.1'
		,'Mozilla/5.0 (iPhone; CPU iPhone OS 13_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1'
		,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36 OPR/48.0.2685.52'
		,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 OPR/67.0.3575.97'
		,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763'
		,'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.83 Safari/537.1'
		,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36');
		
		function randomUserAgent(a) {
			return a[Math.floor(Math.random() * a.length)];
		}

		const page = await browser.newPage();
		console.log('change before : ' + await page.evaluate('navigator.userAgent'));
		await page.setUserAgent(randomUserAgent(userAgentList));
		console.log('change after : ' +  await page.evaluate('navigator.userAgent'));

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

		//await page.goto("https://www.freitag.ch/ko/f41");
		await page.goto("https://www.freitag.ch/ko/f41?f%5B0%5D=neo_product_style%3A1045"); //shape 민무늬 파라미터 적용

		await page.screenshot({ path: 'screenshot/3.png', fullPage:true });

		let color = await page.$$eval("#products-selector > ul > li", colors => colors.map(color => color.getAttribute("data-dimension17")));
		//let shape = await page.$$eval("#products-selector > ul > li", shapes => shapes.map(shape => shape.getAttribute("data-dimension18")));
		let img = await page.$$eval("#products-selector > ul > li > a > img", imgs => imgs.map(img => img.getAttribute('src')));
		
		console.log('li.length : ' + color.length);

		try {
			for(let i=0; color.length > i; i++) {
				//if(color[i].includes('1053') || color[i].includes('583') || color[i].includes('613') || color[i].includes('565') || color[i].includes('580') || color[i].includes('black') && shape[i].includes('plain'))  {
				if(color[i].includes('1053') || color[i].includes('583') || color[i].includes('613') || color[i].includes('565') || color[i].includes('580') || color[i].includes('black'))  { //민무늬 조건 제거
					console.log(color[i]);
					console.log(img[i]);
					//console.log(shape[i]);
					await download(img[i], './screenshot/freitag' + Math.random() + '.jpg');
				}
			}
		} catch (error) {
			console.log('에러입니다 : ' + error);
		}
		await page.close();
	}


