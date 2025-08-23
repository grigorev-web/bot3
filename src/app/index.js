// Экспортируем все классы обработчиков
const CommandHandlers = require('./commandHandlers');
const TextMessageHandler = require('./textMessageHandler');
const MediaMessageHandler = require('./mediaMessageHandler');
const TelegramBotApp = require('./app');

module.exports = {
  CommandHandlers,
  TextMessageHandler,
  MediaMessageHandler,
  TelegramBotApp
};
