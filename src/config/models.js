/**
 * @fileoverview Конфигурация доступных LLM моделей
 * @description Мапа всех доступных нейронок с их параметрами и комментариями
 * @author Telegram Bot Team
 * @version 4.0.0
 * @since 2024-01-01
 */

/**
 * @typedef {Object} ModelConfig
 * @property {string} id - Уникальный идентификатор модели
 * @property {string} name - Человекочитаемое название модели
 * @property {string} provider - Провайдер (openai, anthropic, gemini, deepseek)
 * @property {string} model - Название модели у провайдера
 * @property {string} description - Описание возможностей модели
 * @property {number} maxTokens - Максимальное количество токенов
 * @property {number} temperature - Температура генерации (0.0 - 2.0)
 * @property {string} category - Категория модели (chat, code, creative, etc.)
 * @property {string} language - Основной язык модели
 * @property {boolean} isActive - Активна ли модель
 * @property {string} notes - Дополнительные заметки
 */

/**
 * @type {Object.<string, ModelConfig>}
 * @description Мапа всех доступных LLM моделей
 */
const AVAILABLE_MODELS = {
  // OpenAI модели
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    description: 'Самая мощная модель OpenAI для сложных задач, анализа и творчества',
    maxTokens: 128000,
    temperature: 0.7,
    category: 'chat',
    language: 'multilingual',
    isActive: true,
    notes: 'Лучший выбор для сложных аналитических задач и творческих проектов'
  },

  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    model: 'gpt-4',
    description: 'Базовая GPT-4 модель с отличными возможностями',
    maxTokens: 8192,
    temperature: 0.7,
    category: 'chat',
    language: 'multilingual',
    isActive: true,
    notes: 'Хороший баланс между качеством и стоимостью'
  },

  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    description: 'Быстрая и экономичная модель для повседневных задач',
    maxTokens: 4096,
    temperature: 0.7,
    category: 'chat',
    language: 'multilingual',
    isActive: true,
    notes: 'Идеально для простых чат-задач и быстрых ответов'
  },

  // Anthropic модели
  'claude-3-sonnet': {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    model: 'claude-3-sonnet-20240229',
    description: 'Claude 3 Sonnet - отличный баланс между качеством и скоростью',
    maxTokens: 200000,
    temperature: 0.7,
    category: 'chat',
    language: 'multilingual',
    isActive: true,
    notes: 'Отлично подходит для анализа документов и длинных текстов'
  },

  'claude-3-haiku': {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    model: 'claude-3-haiku-20240307',
    description: 'Самая быстрая модель Claude 3 для быстрых ответов',
    maxTokens: 200000,
    temperature: 0.7,
    category: 'chat',
    language: 'multilingual',
    isActive: true,
    notes: 'Идеально для быстрых вопросов и простых задач'
  },

  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    model: 'claude-3-opus-20240229',
    description: 'Самая мощная модель Claude 3 для сложных задач',
    maxTokens: 200000,
    temperature: 0.7,
    category: 'chat',
    language: 'multilingual',
    isActive: true,
    notes: 'Лучший выбор для сложных аналитических и творческих задач'
  },

  // Google Gemini модели
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'gemini',
    model: 'gemini-pro',
    description: 'Мощная модель Google для широкого спектра задач',
    maxTokens: 32768,
    temperature: 0.7,
    category: 'chat',
    language: 'multilingual',
    isActive: true,
    notes: 'Отлично интегрируется с Google сервисами'
  },

  'gemini-flash': {
    id: 'gemini-flash',
    name: 'Gemini Flash',
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    description: 'Быстрая и экономичная модель Gemini',
    maxTokens: 1048576,
    temperature: 0.7,
    category: 'chat',
    language: 'multilingual',
    isActive: true,
    notes: 'Поддерживает очень длинные контексты'
  },

  // DeepSeek модели
  'deepseek-chat': {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    model: 'deepseek-chat',
    description: 'Мощная модель для чата и анализа',
    maxTokens: 32768,
    temperature: 0.7,
    category: 'chat',
    language: 'multilingual',
    isActive: true,
    notes: 'Хорошо подходит для технических и аналитических задач'
  },

  'deepseek-coder': {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'deepseek',
    model: 'deepseek-coder',
    description: 'Специализированная модель для программирования',
    maxTokens: 16384,
    temperature: 0.2,
    category: 'code',
    language: 'multilingual',
    isActive: true,
    notes: 'Идеально для генерации и анализа кода'
  }
};

/**
 * @type {Object.<string, string[]>}
 * @description Группировка моделей по провайдерам
 */
const MODELS_BY_PROVIDER = {
  openai: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-sonnet', 'claude-3-haiku', 'claude-3-opus'],
  gemini: ['gemini-pro', 'gemini-flash'],
  deepseek: ['deepseek-chat', 'deepseek-coder']
};

/**
 * @type {Object.<string, string[]>}
 * @description Группировка моделей по категориям
 */
const MODELS_BY_CATEGORY = {
  chat: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet', 'claude-3-haiku', 'claude-3-opus', 'gemini-pro', 'gemini-flash', 'deepseek-chat'],
  code: ['deepseek-coder']
};

/**
 * @type {Object.<string, string[]>}
 * @description Группировка моделей по языкам
 */
const MODELS_BY_LANGUAGE = {
  multilingual: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet', 'claude-3-haiku', 'claude-3-opus', 'gemini-pro', 'gemini-flash', 'deepseek-chat', 'deepseek-coder']
};

/**
 * @class ModelManager
 * @description Менеджер для работы с доступными моделями
 */
class ModelManager {
  /**
   * @constructor
   */
  constructor() {
    this.models = AVAILABLE_MODELS;
  }

  /**
   * @group Model Access
   * @description Получает конфигурацию модели по ID
   * @param {string} modelId - ID модели
   * @returns {ModelConfig|null} Конфигурация модели или null
   */
  getModel(modelId) {
    return this.models[modelId] || null;
  }

  /**
   * @group Model Access
   * @description Получает все доступные модели
   * @returns {Object.<string, ModelConfig>} Все модели
   */
  getAllModels() {
    return { ...this.models };
  }

  /**
   * @group Model Access
   * @description Получает активные модели
   * @returns {Object.<string, ModelConfig>} Только активные модели
   */
  getActiveModels() {
    const activeModels = {};
    for (const [id, model] of Object.entries(this.models)) {
      if (model.isActive) {
        activeModels[id] = model;
      }
    }
    return activeModels;
  }

  /**
   * @group Model Access
   * @description Получает модели по провайдеру
   * @param {string} provider - Провайдер
   * @returns {Object.<string, ModelConfig>} Модели провайдера
   */
  getModelsByProvider(provider) {
    const providerModels = {};
    for (const modelId of MODELS_BY_PROVIDER[provider] || []) {
      if (this.models[modelId]) {
        providerModels[modelId] = this.models[modelId];
      }
    }
    return providerModels;
  }

  /**
   * @group Model Access
   * @description Получает модели по категории
   * @param {string} category - Категория
   * @returns {Object.<string, ModelConfig>} Модели категории
   */
  getModelsByCategory(category) {
    const categoryModels = {};
    for (const modelId of MODELS_BY_CATEGORY[category] || []) {
      if (this.models[modelId]) {
        categoryModels[modelId] = this.models[modelId];
      }
    }
    return categoryModels;
  }

  /**
   * @group Model Access
   * @description Получает модели по языку
   * @param {string} language - Язык
   * @returns {Object.<string, ModelConfig>} Модели языка
   */
  getModelsByLanguage(language) {
    const languageModels = {};
    for (const modelId of MODELS_BY_LANGUAGE[language] || []) {
      if (this.models[modelId]) {
        languageModels[modelId] = this.models[modelId];
      }
    }
    return languageModels;
  }

  /**
   * @group Model Search
   * @description Ищет модели по названию или описанию
   * @param {string} query - Поисковый запрос
   * @returns {Object.<string, ModelConfig>} Найденные модели
   */
  searchModels(query) {
    const searchResults = {};
    const lowerQuery = query.toLowerCase();
    
    for (const [id, model] of Object.entries(this.models)) {
      if (model.name.toLowerCase().includes(lowerQuery) ||
          model.description.toLowerCase().includes(lowerQuery) ||
          model.category.toLowerCase().includes(lowerQuery)) {
        searchResults[id] = model;
      }
    }
    
    return searchResults;
  }

  /**
   * @group Model Info
   * @description Получает статистику по моделям
   * @returns {Object} Статистика моделей
   */
  getModelStats() {
    const total = Object.keys(this.models).length;
    const active = Object.values(this.models).filter(m => m.isActive).length;
    const byProvider = {};
    const byCategory = {};
    
    for (const model of Object.values(this.models)) {
      byProvider[model.provider] = (byProvider[model.provider] || 0) + 1;
      byCategory[model.category] = (byCategory[model.category] || 0) + 1;
    }
    
    return {
      total,
      active,
      byProvider,
      byCategory
    };
  }

  /**
   * @group Model Validation
   * @description Проверяет, существует ли модель
   * @param {string} modelId - ID модели
   * @returns {boolean} true если модель существует
   */
  modelExists(modelId) {
    return !!this.models[modelId];
  }

  /**
   * @group Model Validation
   * @description Проверяет, активна ли модель
   * @param {string} modelId - ID модели
   * @returns {boolean} true если модель активна
   */
  isModelActive(modelId) {
    const model = this.models[modelId];
    return model ? model.isActive : false;
  }
}

// Создаем экземпляр менеджера моделей
const modelManager = new ModelManager();

module.exports = {
  AVAILABLE_MODELS,
  MODELS_BY_PROVIDER,
  MODELS_BY_CATEGORY,
  MODELS_BY_LANGUAGE,
  ModelManager,
  modelManager
};
