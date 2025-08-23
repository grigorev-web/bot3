require('dotenv').config();
const { TelegramBotApp } = require('./app');

let botApp = null;

// Функция для запуска бота
function startBot() {
  try {
    console.log('🚀 Запускаю телеграм бота...');
    botApp = new TelegramBotApp(process.env.BOT_TOKEN);
  } catch (error) {
    console.error('❌ Ошибка запуска бота:', error);
    process.exit(1);
  }
}

// Функция для остановки бота
function stopBot() {
  if (botApp) {
    console.log('\n🛑 Останавливаю бота...');
    botApp.stop();
    botApp = null;
  }
}

// Обработчики сигналов
process.on('SIGINT', () => {
  stopBot();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopBot();
  process.exit(0);
});

// Обработчик для nodemon restart
process.on('SIGUSR2', () => {
  console.log('🔄 Получен сигнал SIGUSR2 (nodemon restart)...');
  stopBot();
  // nodemon автоматически перезапустит процесс
});

// Обработчик необработанных ошибок
process.on('uncaughtException', (error) => {
  console.error('❌ Необработанная ошибка:', error);
  stopBot();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Необработанное отклонение промиса:', reason);
  stopBot();
  process.exit(1);
});

// Запускаем бота
startBot();
