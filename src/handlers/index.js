// Экспортируем все обработчики
const CommandHandlers = require('./commandHandlers');
const TextMessageHandler = require('./textMessageHandler');
const MediaMessageHandler = require('./mediaMessageHandler');
const EventHandlers = require('./eventHandlers');

module.exports = {
  CommandHandlers,
  TextMessageHandler,
  MediaMessageHandler,
  EventHandlers
};
