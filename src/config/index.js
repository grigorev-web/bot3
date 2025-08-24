/**
 * @fileoverview Главный индекс конфигурации приложения
 * @description Экспортирует все конфигурационные модули
 * @author Bot3 Development Team
 * @version 2.0.0
 */

// Экспортируем основную конфигурацию
module.exports = {
  development: require('./development'),
  
  // LLM конфигурация
  llmConfig: require('./llm'),
  
  // Модели и менеджер
  modelManager: require('./models').modelManager,
  AVAILABLE_MODELS: require('./models').AVAILABLE_MODELS,
  
  // Удобные геттеры
  getDefaultProvider: () => require('./llm').defaultProvider,
  getProviderConfig: (provider) => require('./llm')[provider]
};
