const TelegramBot = require('node-telegram-bot-api');
const CommandHandlers = require('./commandHandlers');
const TextMessageHandler = require('./textMessageHandler');
const MediaMessageHandler = require('./mediaMessageHandler');

class TelegramBotApp {
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true });
    
    // Инициализируем обработчики
    this.commandHandlers = new CommandHandlers(this.bot);
    this.textMessageHandler = new TextMessageHandler(this.bot);
    this.mediaMessageHandler = new MediaMessageHandler(this.bot);
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Обработчики команд
    this.bot.onText(/\/start/, (msg) => {
      this.commandHandlers.handleStart(msg);
    });

    this.bot.onText(/\/help/, (msg) => {
      this.commandHandlers.handleHelp(msg);
    });

    this.bot.onText(/\/echo (.+)/, (msg, match) => {
      this.commandHandlers.handleEcho(msg, match);
    });

    this.bot.onText(/\/info/, (msg) => {
      this.commandHandlers.handleInfo(msg);
    });

    this.bot.onText(/\/time/, (msg) => {
      this.commandHandlers.handleTime(msg);
    });

    // Обработчик всех сообщений
    this.bot.on('message', (msg) => {
      this.handleMessage(msg);
    });

    // Обработчик ошибок
    this.bot.on('polling_error', (error) => {
      this.handlePollingError(error);
    });

    // Обработчик успешного запуска
    this.bot.on('polling_start', () => {
      this.handlePollingStart();
    });
  }

  handleMessage(msg) {
    // Сначала пробуем обработать как медиа
    if (this.mediaMessageHandler.canHandle(msg)) {
      if (this.mediaMessageHandler.handleMediaMessage(msg)) {
        return;
      }
    }
    
    // Затем пробуем обработать как текстовое сообщение
    if (this.textMessageHandler.canHandle(msg)) {
      if (this.textMessageHandler.handleTextMessage(msg)) {
        return;
      }
    }
    
    // Если ничего не подошло, отправляем общее сообщение
    const chatId = msg.chat.id;
    this.bot.sendMessage(chatId, '✅ Получил ваше сообщение! Спасибо за обращение.');
  }

  handlePollingError(error) {
    console.error('Ошибка поллинга:', error);
  }

  handlePollingStart() {
    console.log('🤖 Бот запущен и использует поллинг...');
    console.log('📱 Бот готов к работе!');
  }

  stop() {
    console.log('🛑 Останавливаю бота...');
    this.bot.stopPolling();
  }

  getBot() {
    return this.bot;
  }
}

module.exports = TelegramBotApp;
