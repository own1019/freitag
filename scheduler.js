const schedule = require('node-schedule');
const doPuppeteer = require('./index.js');

schedule.scheduleJob('*/30 * * * * *', () => {
	let date = new Date();
 	console.log(date)
	doPuppeteer();
});