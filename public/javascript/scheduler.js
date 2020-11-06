const schedule = require('node-schedule');
const doPuppeteer = require('../../index.js');

schedule.scheduleJob('59 * * * * *', () => {
	let date = new Date();
 	console.log(date.toLocaleString('ko-KR'));
	doPuppeteer();
});