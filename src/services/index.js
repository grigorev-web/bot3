/**
 * @fileoverview Индексный файл для сервисов
 * @description Экспортирует все внешние сервисы приложения (API, базы данных и т.д.)
 * @author Telegram Bot Team
 * @version 2.0.0
 * @since 2024-01-01
 */

// Экспортируем все сервисы
const { LLMService } = require('./llm');

/**
 * @module services
 * @description Модуль внешних сервисов приложения
 */
module.exports = {
  /**
   * @type {LLMService}
   * @description Сервис для работы с LLM API через ProxyAPI
   */
  LLMService
};
