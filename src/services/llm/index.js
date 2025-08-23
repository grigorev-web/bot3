/**
 * @fileoverview Индексный файл для модуля LLM
 * @description Экспортирует сервисы для работы с языковыми моделями
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 */

const LLMService = require('./llmService');

/**
 * @module llm
 * @description Модуль для работы с LLM (Large Language Models)
 */
module.exports = {
  /**
   * @type {LLMService}
   * @description Основной сервис для работы с LLM API
   */
  LLMService
};
