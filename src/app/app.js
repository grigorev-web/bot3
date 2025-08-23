/**
 * @fileoverview Основной класс приложения Telegram бота
 * @description Управляет жизненным циклом бота и обработкой сообщений
 * @author Telegram Bot Team
 * @version 2.0.0
 * @since 2024-01-01
 * @requires ../handlers/commandHandlers
 * @requires ../handlers/textMessageHandler
 * @requires ../handlers/mediaMessageHandler
 * @requires ../handlers/eventHandlers
 */

const TelegramBot = require('node-telegram-bot-api');
const CommandHandlers = require('../handlers/commandHandlers');
const TextMessageHandler = require('../handlers/textMessageHandler');
const MediaMessageHandler = require('../handlers/mediaMessageHandler');
const EventHandlers = require('../handlers/eventHandlers');

/**
 * @typedef {Object} BotConfig
 * @property {boolean} [polling=true] - Включить polling режим
 * @property {number} [pollingTimeout=10] - Таймаут polling в секундах
 */

/**
 * @class TelegramBotApp
 * @description Основной класс приложения Telegram бота
 * @example
 * const botApp = new TelegramBotApp('YOUR_BOT_TOKEN');
 * botApp.start();
 */
class TelegramBotApp {
  /**
   * @constructor
   * @param {string} token - Токен бота от BotFather
   * @param {BotConfig} [config] - Дополнительная конфигурация бота
   * @throws {Error} Если токен не передан или недействителен
   */
  constructor(token, config = {}) {
    if (!token) {
      throw new Error('Токен бота обязателен для создания приложения');
    }

    this.token = token;
    this.config = {
      polling: true,
      pollingTimeout: 10,
      ...config
    };

    // Инициализируем экземпляр бота
    this.bot = new TelegramBot(token, this.config);
    
    // Инициализируем обработчики
    this.initializeHandlers();
    
    // Настраиваем обработчики событий
    this.setupEventHandlers();
    
    console.log('🔧 Приложение Telegram бота инициализировано');
  }

  /**
   * @group Initialization
   * @description Инициализирует все обработчики сообщений и событий
   * @private
   */
  initializeHandlers() {
    this.commandHandlers = new CommandHandlers(this.bot);
    this.mediaMessageHandler = new MediaMessageHandler(this.bot);
    this.eventHandlers = new EventHandlers(this.bot);
    this.textMessageHandler = new TextMessageHandler(this.bot);
    
    console.log('✅ Все обработчики созданы');
  }

  /**
   * @group Event Handling
   * @description Настраивает все обработчики событий бота
   * @private
   */
  setupEventHandlers() {
    this.setupCommandHandlers();
    this.setupMessageHandlers();
    this.setupSystemHandlers();
    
    console.log('✅ Обработчики событий настроены');
  }

  /**
   * @group Command Handling
   * @description Настраивает обработчики команд бота
   * @private
   */
  setupCommandHandlers() {
    // Обработчик команды /start
    this.bot.onText(/\/start/, (msg) => {
      this.commandHandlers.handleStart(msg);
    });

    // Обработчик команды /help
    this.bot.onText(/\/help/, (msg) => {
      this.commandHandlers.handleHelp(msg);
    });

    console.log('✅ Обработчики команд настроены');
  }

  /**
   * @group Message Handling
   * @description Настраивает обработчики сообщений
   * @private
   */
  setupMessageHandlers() {
    // Обработчик всех входящих сообщений
    this.bot.on('message', async (msg) => {
      await this.handleMessage(msg);
    });

    console.log('✅ Обработчики сообщений настроены');
  }

  /**
   * @group System Handling
   * @description Настраивает системные обработчики
   * @private
   */
  setupSystemHandlers() {
    // Обработчик ошибок polling
    this.bot.on('polling_error', (error) => {
      this.eventHandlers.handlePollingError(error);
    });

    // Обработчик начала polling
    this.bot.on('polling_start', () => {
      this.eventHandlers.handlePollingStart();
    });

    // Обработчик остановки polling
    this.bot.on('polling_stop', () => {
      this.eventHandlers.handlePollingStop();
    });

    // Обработчик ошибок webhook
    this.bot.on('webhook_error', (error) => {
      this.eventHandlers.handleWebhookError(error);
    });

    // Обработчик общих ошибок
    this.bot.on('error', (error) => {
      this.eventHandlers.handleError(error);
    });

    console.log('✅ Системные обработчики настроены');
  }

  /**
   * @group Message Processing
   * @description Обрабатывает входящие сообщения в порядке приоритета
   * @param {Object} msg - Объект сообщения от Telegram
   * @returns {boolean} true если сообщение обработано, false в противном случае
   * @private
   */
  async handleMessage(msg) {
    const chatId = msg.chat.id;
    
    try {
      // Сначала пробуем обработать как медиа
      if (this.mediaMessageHandler.canHandle(msg)) {
        if (this.mediaMessageHandler.handleMediaMessage(msg)) {
          return true;
        }
      }
      
      // Затем пробуем обработать как текстовое сообщение
      if (this.textMessageHandler.canHandle(msg)) {
        if (this.textMessageHandler.handleTextMessage(msg)) {
          return true;
        }
      }
      
      // Если ничего не подошло, отправляем общее сообщение
      this.sendDefaultResponse(chatId);
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка обработки сообщения:', error);
      this.sendErrorMessage(chatId);
      return false;
    }
  }

  /**
   * @group Response Handling
   * @description Отправляет стандартный ответ на необработанные сообщения
   * @param {number} chatId - ID чата для отправки ответа
   * @private
   */
  sendDefaultResponse(chatId) {
    const response = '✅ Получил ваше сообщение! Спасибо за обращение.';
    this.bot.sendMessage(chatId, response);
  }

  /**
   * @group Response Handling
   * @description Отправляет сообщение об ошибке
   * @param {number} chatId - ID чата для отправки ответа
   * @private
   */
  sendErrorMessage(chatId) {
    const errorMessage = '❌ Произошла ошибка при обработке вашего сообщения. Попробуйте позже.';
    this.bot.sendMessage(chatId, errorMessage);
  }

  /**
   * @group Lifecycle Management
   * @description Запускает бота
   */
  start() {
    console.log('🚀 Запускаю бота...');
    
    // Проверяем, не запущен ли уже polling
    if (this.bot.isPolling()) {
      console.log('⚠️ Бот уже запущен, пропускаю запуск');
      return;
    }
    
    // Настраиваем обработчики ошибок поллинга
    this.bot.on('polling_error', (error) => {
      console.warn('⚠️ Ошибка поллинга (попытка переподключения):', error.message);
      
      // Если это критическая ошибка, пытаемся перезапустить поллинг
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        console.log('🔄 Перезапускаю поллинг через 5 секунд...');
        setTimeout(() => {
          if (!this.bot.isPolling()) {
            try {
              this.bot.startPolling();
              console.log('✅ Поллинг перезапущен');
            } catch (restartError) {
              console.error('❌ Не удалось перезапустить поллинг:', restartError.message);
            }
          }
        }, 5000);
      }
    });
    
    this.bot.startPolling();
    console.log('✅ Бот запущен');
  }

  /**
   * @group Lifecycle Management
   * @description Останавливает бота и освобождает ресурсы
   */
  stop() {
    console.log('🛑 Останавливаю приложение бота...');
    
    try {
      this.eventHandlers.handlePollingStop();
      this.bot.stopPolling();
      console.log('✅ Бот успешно остановлен');
    } catch (error) {
      console.error('❌ Ошибка при остановке бота:', error);
    }
  }

  /**
   * @group Accessors
   * @description Возвращает экземпляр бота для внешнего использования
   * @returns {TelegramBot} Экземпляр бота
   */
  getBot() {
    return this.bot;
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о состоянии приложения
   * @returns {Object} Информация о состоянии
   */
  getStatus() {
    return {
      isRunning: this.bot.isPolling(),
      token: this.token ? '***' + this.token.slice(-4) : 'не установлен',
      handlers: {
        commands: !!this.commandHandlers,
        text: !!this.textMessageHandler,
        media: !!this.mediaMessageHandler,
        events: !!this.eventHandlers
      }
    };
  }
}

module.exports = TelegramBotApp;
