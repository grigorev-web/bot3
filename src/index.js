require('dotenv').config();
const TelegramBotApp = require('./app');

// Создаем экземпляр приложения бота
const botApp = new TelegramBotApp(process.env.BOT_TOKEN);

// Обработчик остановки
process.on('SIGINT', () => {
  console.log('\n🛑 Останавливаю бота...');
  botApp.stop();
  process.exit(0);
});

console.log('🚀 Запускаю телеграм бота...');
