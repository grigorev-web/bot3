/**
 * @fileoverview Главный файл приложения Telegram бота
 * @description Точка входа в приложение, настройка обработчиков и запуск бота
 * @author Telegram Bot Team
 * @version 2.0.0
 * @since 2024-01-01
 * @requires dotenv
 * @requires ./app/app
 */

// Загружаем переменные окружения
require('dotenv').config();

const TelegramBotApp = require('./app/app');

// Глобальная переменная для экземпляра приложения
let botApp = null;

/**
 * @group Application Bootstrap
 * @description Инициализирует приложение и настраивает обработчики
 */
function bootstrap() {
  console.log('🚀 Инициализация Telegram бота...');
  
  // Настраиваем обработчики сигналов
  setupSignalHandlers();
  
  // Настраиваем обработчики ошибок
  setupErrorHandlers();
  
  // Запускаем бота
  startBot();
  
  console.log('🎯 Приложение готово к работе');
}

/**
 * @group Bot Management
 * @description Запускает бота с обработкой ошибок
 * @throws {Error} Если не удается создать экземпляр бота
 */
function startBot() {
  try {
    if (!process.env.BOT_TOKEN) {
      throw new Error('BOT_TOKEN не найден в переменных окружения');
    }
    
    console.log('🔧 Создаю экземпляр бота...');
    botApp = new TelegramBotApp(process.env.BOT_TOKEN);
    
    console.log('🚀 Запускаю бота...');
    botApp.start();
    
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

// Запускаем приложение
bootstrap();
