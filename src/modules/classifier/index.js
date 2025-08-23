/**
 * @fileoverview Индексный файл для модуля классификатора
 * @description Экспортирует сервисы для классификации сообщений
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 */

const MessageClassifier = require('./messageClassifier');

/**
 * @module classifier
 * @description Модуль для классификации сообщений с использованием LLM
 */
module.exports = {
  /**
   * @type {MessageClassifier}
   * @description Классификатор сообщений с LLM
   */
  MessageClassifier
};
