/**
 * @fileoverview Индексный файл для модулей
 * @description Экспортирует все логические модули бота (роутер, классификатор и т.д.)
 * @author Telegram Bot Team
 * @version 2.0.0
 * @since 2024-01-01
 */

// Экспортируем все модули
const { SmartRouter } = require('./router');
const { MessageClassifier } = require('./classifier');

/**
 * @module modules
 * @description Модуль логических компонентов бота
 */
module.exports = {
  /**
   * @type {SmartRouter}
   * @description Умный роутер с LLM классификацией сообщений
   */
  SmartRouter,
  
  /**
   * @type {MessageClassifier}
   * @description Классификатор сообщений с использованием LLM
   */
  MessageClassifier
};
