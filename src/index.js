/**
 * @fileoverview Главный файл приложения Telegram бота
 * @description Точка входа в приложение, управление жизненным циклом бота
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 */

require('dotenv').config();
const { TelegramBotApp } = require('./app');

/**
 * @type {TelegramBotApp|null} Экземпляр основного приложения бота
 */
let botApp = null;

/**
 * @group Lifecycle Management
 * @description Запускает телеграм бота с обработкой ошибок
 * @throws {Error} Если не удается создать экземпляр бота
 */
function startBot() {
  try {
    console.log('🚀 Запускаю телеграм бота...');
    botApp = new TelegramBotApp(process.env.BOT_TOKEN);
    console.log('✅ Бот успешно запущен');
  } catch (error) {
    console.error('❌ Ошибка запуска бота:', error);
    process.exit(1);
  }
}

/**
 * @group Lifecycle Management
 * @description Останавливает бота и освобождает ресурсы
 */
function stopBot() {
  if (botApp) {
    console.log('\n🛑 Останавливаю бота...');
    botApp.stop();
    botApp = null;
    console.log('✅ Бот остановлен');
  }
}

/**
 * @group Signal Handlers
 * @description Настраивает обработчики системных сигналов
 */
function setupSignalHandlers() {
  // Обработчик прерывания (Ctrl+C)
  process.on('SIGINT', () => {
    console.log('\n📡 Получен сигнал SIGINT (Ctrl+C)');
    stopBot();
    process.exit(0);
  });

  // Обработчик завершения процесса
  process.on('SIGTERM', () => {
    console.log('\n📡 Получен сигнал SIGTERM');
    stopBot();
    process.exit(0);
  });

  // Обработчик для nodemon restart
  process.on('SIGUSR2', () => {
    console.log('🔄 Получен сигнал SIGUSR2 (nodemon restart)...');
    stopBot();
    // nodemon автоматически перезапустит процесс
  });
}

/**
 * @group Error Handling
 * @description Настраивает обработчики необработанных ошибок
 */
function setupErrorHandlers() {
  // Обработчик необработанных ошибок
  process.on('uncaughtException', (error) => {
    console.error('❌ Необработанная ошибка:', error);
    console.error('📁 Стек вызовов:', error.stack);
    stopBot();
    process.exit(1);
  });

  // Обработчик необработанных отклонений промисов
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Необработанное отклонение промиса:', reason);
    console.error('🔗 Промис:', promise);
    stopBot();
    process.exit(1);
  });
}

/**
 * @group Application Bootstrap
 * @description Инициализирует приложение и настраивает обработчики
 */
async function bootstrap() {
  console.log('🚀 Инициализация Telegram бота...');
  
  // Настраиваем обработчики сигналов
  setupSignalHandlers();
  
  // Настраиваем обработчики ошибок
  setupErrorHandlers();
  
  // Запускаем бота
  startBot();
  
  // Инициализируем асинхронные компоненты
  if (botApp) {
    try {
      await botApp.initialize();
      console.log('🎯 Приложение полностью готово к работе');
    } catch (error) {
      console.error('❌ Ошибка инициализации асинхронных компонентов:', error);
      console.log('⚠️ Приложение запущено с базовой функциональностью');
    }
  }
  
  console.log('🎯 Приложение готово к работе');
}

// Запускаем приложение
bootstrap();
