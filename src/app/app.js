const TelegramBot = require('node-telegram-bot-api');
const { CommandHandlers, TextMessageHandler, MediaMessageHandler, EventHandlers } = require('../handlers');

class TelegramBotApp {
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true });
    
    // Инициализируем обработчики
    this.commandHandlers = new CommandHandlers(this.bot);
    this.textMessageHandler = new TextMessageHandler(this.bot);
    this.mediaMessageHandler = new MediaMessageHandler(this.bot);
    this.eventHandlers = new EventHandlers(this.bot);
    
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

    // Обработчик всех сообщений
    this.bot.on('message', (msg) => {
      this.handleMessage(msg);
    });

    // Обработчик ошибок
    this.bot.on('polling_error', (error) => {
      this.eventHandlers.handlePollingError(error);
    });

    // Обработчик успешного запуска
    this.bot.on('polling_start', () => {
      this.eventHandlers.handlePollingStart();
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



  stop() {
    this.eventHandlers.handlePollingStop();
    this.bot.stopPolling();
  }

  getBot() {
    return this.bot;
  }
}

module.exports = TelegramBotApp;
