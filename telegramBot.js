const TelegramBot = require('node-telegram-bot-api');
const https = require('https');

function telegramBot(a) {
    // replace the value below with the Telegram token you receive from @BotFather
    const token = '1416921767:AAEj07EBf_hOt-we9zN0vUcla1SENkDFTu0';
    
    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, {polling: true});
    const CHAT_ID = '1348047190';
    const text = '프라이탁 제품이 업데이트 되었습니다.';
    const url = 'https://freitag.rokka.io/neo_square_thumbnail/502784d5e6f4ce4f65742c945c4cc399879c4207/000002438106-1.jpg';
    //const img = https.get(a);

    bot.sendMessage(CHAT_ID,text);
    bot.sendPhoto(url);
}
exports.telegramBot = telegramBot;

