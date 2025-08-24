/**
 * @fileoverview Индексный файл для конфигурации моделей
 * @description Экспортирует все настройки LLM моделей и провайдеров
 * @author Telegram Bot Team
 * @version 4.0.0
 * @since 2024-01-01
 */

const { modelManager, AVAILABLE_MODELS } = require('./models');
const llmConfig = require('./llm');

module.exports = {
  // Менеджер моделей
  modelManager,
  AVAILABLE_MODELS,
  
  // Конфигурация LLM
  llmConfig,
  
  // Удобные геттеры
  getDefaultProvider: () => llmConfig.defaultProvider,
  getProviderConfig: (provider) => llmConfig.providers[provider],
  getGlobalConfig: () => llmConfig.global
};
