/**
 * @fileoverview Индексный файл для модуля обработчиков
 * @description Экспортирует все классы обработчиков сообщений и событий
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Экспортируем все обработчики
const CommandHandlers = require('./commandHandlers');
const TextMessageHandler = require('./textMessageHandler');
const MediaMessageHandler = require('./mediaMessageHandler');
const EventHandlers = require('./eventHandlers');

/**
 * @module handlers
 * @description Модуль обработчиков сообщений и событий Telegram бота
 */
module.exports = {
  /**
   * @type {CommandHandlers}
   * @description Обработчик команд бота (/start, /help, etc.)
   */
  CommandHandlers,
  
  /**
   * @type {TextMessageHandler}
   * @description Обработчик текстовых сообщений пользователей
   */
  TextMessageHandler,
  
  /**
   * @type {MediaMessageHandler}
   * @description Обработчик медиа сообщений (фото, документы, аудио, etc.)
   */
  MediaMessageHandler,
  
  /**
   * @type {EventHandlers}
   * @description Обработчик системных событий и мониторинга
   */
  EventHandlers
};
