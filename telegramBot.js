process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const token = '1416921767:AAEj07EBf_hOt-we9zN0vUcla1SENkDFTu0';
const CHAT_ID = '1348047190';
const bot = new TelegramBot(token, {polling: true});
const text = '프라이탁 제품이 업데이트 되었습니다.';

async function telegramBot(imgUrl) {
    await bot.sendMessage(CHAT_ID, text);
    await bot.sendPhoto(CHAT_ID, imgUrl);
}
exports.telegramBot = telegramBot;
