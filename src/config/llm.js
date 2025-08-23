/**
 * @fileoverview Конфигурация LLM сервиса
 * @description Настройки для различных провайдеров LLM API
 * @author Telegram Bot Team
 * @version 2.0.0
 * @since 2024-01-01
 */

/**
 * @typedef {Object} LLMProviderConfig
 * @property {string} apiUrl - URL API провайдера
 * @property {string} model - Модель для использования
 * @property {number} maxTokens - Максимальное количество токенов
 * @property {number} temperature - Температура генерации (0.0 - 1.0)
 * @property {number} timeout - Таймаут запроса в миллисекундах
 */

/**
 * @typedef {Object} LLMGlobalConfig
 * @property {number} maxRetries - Максимальное количество попыток
 * @property {boolean} enableCaching - Включить кэширование
 * @property {boolean} enableLogging - Включить логирование
 */

/**
 * @typedef {Object} LLMConfig
 * @property {string} defaultProvider - Провайдер по умолчанию
 * @property {Object.<string, LLMProviderConfig>} providers - Конфигурации провайдеров
 * @property {LLMGlobalConfig} global - Глобальные настройки
 */

/**
 * Конфигурация LLM сервиса
 * @type {LLMConfig}
 */
const llmConfig = {
  defaultProvider: 'proxyApi',
  
  providers: {
    proxyApi: {
      apiUrl: process.env.PROXYAPI_URL || 'https://api.proxyapi.com/v1',
      model: process.env.PROXYAPI_MODEL || 'gpt-3.5-turbo',
      maxTokens: parseInt(process.env.PROXYAPI_MAX_TOKENS) || 1000,
      temperature: parseFloat(process.env.PROXYAPI_TEMPERATURE) || 0.7,
      timeout: parseInt(process.env.PROXYAPI_TIMEOUT) || 30000
    }
  },
  
  global: {
    maxRetries: parseInt(process.env.LLM_MAX_RETRIES) || 3,
    enableCaching: process.env.LLM_ENABLE_CACHING === 'true',
    enableLogging: process.env.LLM_ENABLE_LOGGING !== 'false'
  }
};

module.exports = llmConfig;
