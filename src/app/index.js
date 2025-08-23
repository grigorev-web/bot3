// Экспортируем все классы обработчиков
const CommandHandlers = require('./commandHandlers');
const TextMessageHandler = require('./textMessageHandler');
const MediaMessageHandler = require('./mediaMessageHandler');
const EventHandlers = require('./eventHandlers');
const TelegramBotApp = require('./app');

module.exports = {
  CommandHandlers,
  TextMessageHandler,
  MediaMessageHandler,
  EventHandlers,
  TelegramBotApp
};
