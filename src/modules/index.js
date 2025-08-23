/**
 * @fileoverview Индексный файл для модуля модулей
 * @description Экспортирует все вспомогательные модули приложения
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Экспортируем все модули
const Router = require('./router');

/**
 * @module modules
 * @description Модуль вспомогательных компонентов приложения
 */
module.exports = {
  /**
   * @type {Router}
   * @description Модуль роутинга для обработки текстовых сообщений
   */
  Router
};
