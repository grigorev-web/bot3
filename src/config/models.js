/**
 * @fileoverview Конфигурация доступных LLM моделей с актуальными ценами в рублях
 * @author Bot3 Development Team
 * @version 2.1.0
 * @description Централизованная конфигурация всех доступных LLM моделей
 */

/**
 * @typedef {Object} ModelCost
 * @property {number} input - Стоимость за 1K входных токенов в рублях
 * @property {number} output - Стоимость за 1K выходных токенов в рублях
 * @property {string} currency - Валюта (RUB)
 * @property {string} unit - Единица измерения (за 1K токенов)
 */

/**
 * @typedef {Object} ModelConfig
 * @property {string} id - Уникальный идентификатор модели
 * @property {string} name - Название модели
 * @property {string} provider - Провайдер (OpenAI, Anthropic, Google, DeepSeek)
 * @property {string} model - Техническое название модели для API
 * @property {string} description - Описание возможностей модели
 * @property {number} maxTokens - Максимальное количество токенов
 * @property {number} temperature - Температура генерации (0-2)
 * @property {string} category - Категория модели
 * @property {string} language - Поддерживаемые языки
 * @property {boolean} isActive - Активна ли модель
 * @property {string} notes - Дополнительные заметки
 * @property {ModelCost} cost - Стоимость использования модели
 */

/**
 * Доступные модели с актуальными ценами в рублях
 * @type {Object.<string, ModelConfig>}
 */
const AVAILABLE_MODELS = {
  // OpenAI модели
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    model: 'gpt-4o-2024-11-20',
    description: 'Самая мощная модель для сложных задач',
    maxTokens: 128000,
    temperature: 0.7,
    category: 'premium',
    language: 'multilingual',
    isActive: true,
    notes: 'Лучшая модель для сложных аналитических задач',
    cost: {
      input: 612,
      output: 2448,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    model: 'gpt-4o-mini-2024-07-18',
    description: 'Быстрая и экономичная версия GPT-4o',
    maxTokens: 128000,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Отличный баланс цена/качество',
    cost: {
      input: 36.72,
      output: 146.88,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    model: 'gpt-4-turbo-2024-04-09',
    description: 'Мощная модель для сложных задач',
    maxTokens: 128000,
    temperature: 0.7,
    category: 'premium',
    language: 'multilingual',
    isActive: true,
    notes: 'Для сложных аналитических и творческих задач',
    cost: {
      input: 2448,
      output: 7344,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    model: 'gpt-4-0125-preview',
    description: 'Базовая GPT-4 с отличными возможностями',
    maxTokens: 8192,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Хороший баланс цена/качество',
    cost: {
      input: 2448,
      output: 7344,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    model: 'gpt-3.5-turbo-0125',
    description: 'Быстрая и экономичная модель',
    maxTokens: 4096,
    temperature: 0.7,
    category: 'economy',
    language: 'multilingual',
    isActive: true,
    notes: 'Для повседневных задач и быстрых ответов',
    cost: {
      input: 122.40,
      output: 367.20,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gpt-5': {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    model: 'gpt-5-2025-08-07',
    description: 'Новейшая модель OpenAI',
    maxTokens: 128000,
    temperature: 0.7,
    category: 'premium',
    language: 'multilingual',
    isActive: true,
    notes: 'Самая новая и мощная модель',
    cost: {
      input: 306,
      output: 2448,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gpt-5-mini': {
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    provider: 'OpenAI',
    model: 'gpt-5-mini-2025-08-07',
    description: 'Компактная версия GPT-5',
    maxTokens: 128000,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Быстрая версия GPT-5',
    cost: {
      input: 61.20,
      output: 489.60,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gpt-5-nano': {
    id: 'gpt-5-nano',
    name: 'GPT-5 Nano',
    provider: 'OpenAI',
    model: 'gpt-5-nano-2025-08-07',
    description: 'Самая компактная версия GPT-5',
    maxTokens: 128000,
    temperature: 0.7,
    category: 'economy',
    language: 'multilingual',
    isActive: true,
    notes: 'Самая экономичная версия GPT-5',
    cost: {
      input: 12.24,
      output: 97.92,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gpt-4o-mini-audio': {
    id: 'gpt-4o-mini-audio',
    name: 'GPT-4o Mini Audio',
    provider: 'OpenAI',
    model: 'gpt-4o-mini-audio-preview-2024-12-17',
    description: 'GPT-4o Mini с поддержкой аудио',
    maxTokens: 128000,
    temperature: 0.7,
    category: 'specialized',
    language: 'multilingual',
    isActive: true,
    notes: 'Поддержка аудио ввода и вывода',
    cost: {
      input: 2448,
      output: 4896,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gpt-4o-audio': {
    id: 'gpt-4o-audio',
    name: 'GPT-4o Audio',
    provider: 'OpenAI',
    model: 'gpt-4o-audio-preview-2024-12-17',
    description: 'GPT-4o с поддержкой аудио',
    maxTokens: 128000,
    temperature: 0.7,
    category: 'premium',
    language: 'multilingual',
    isActive: true,
    notes: 'Полноценная GPT-4o с аудио',
    cost: {
      input: 24480,
      output: 48960,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },

  // Anthropic модели
  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    model: 'claude-3-opus-20240229',
    description: 'Самая мощная модель Claude 3',
    maxTokens: 200000,
    temperature: 0.7,
    category: 'premium',
    language: 'multilingual',
    isActive: true,
    notes: 'Для сложных аналитических и творческих задач',
    cost: {
      input: 3672,
      output: 18360,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'claude-3-sonnet': {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    model: 'claude-3-5-sonnet-20241022',
    description: 'Отличный баланс качества и скорости',
    maxTokens: 200000,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Для анализа документов и длинных текстов',
    cost: {
      input: 734.40,
      output: 3672,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'claude-3-haiku': {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    model: 'claude-3-5-haiku-20241022',
    description: 'Самая быстрая модель Claude 3',
    maxTokens: 200000,
    temperature: 0.7,
    category: 'economy',
    language: 'multilingual',
    isActive: true,
    notes: 'Для быстрых вопросов и простых задач',
    cost: {
      input: 244.80,
      output: 1224,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'claude-3-7-sonnet': {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    model: 'claude-3-7-sonnet-20250219',
    description: 'Новая версия Claude 3.7 Sonnet',
    maxTokens: 200000,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Улучшенная версия Sonnet',
    cost: {
      input: 734.40,
      output: 3672,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    model: 'claude-3-5-sonnet-20241022',
    description: 'Claude 3.5 Sonnet для стандартных задач',
    maxTokens: 200000,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Стандартная версия Claude 3.5',
    cost: {
      input: 734.40,
      output: 3672,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'claude-3-5-haiku': {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    model: 'claude-3-5-haiku-20241022',
    description: 'Claude 3.5 Haiku для быстрых задач',
    maxTokens: 200000,
    temperature: 0.7,
    category: 'economy',
    language: 'multilingual',
    isActive: true,
    notes: 'Быстрая версия Claude 3.5',
    cost: {
      input: 244.80,
      output: 1224,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },

  // Google Gemini модели
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    model: 'gemini-2.5-pro',
    description: 'Мощная модель для широкого спектра задач',
    maxTokens: 1000000,
    temperature: 0.7,
    category: 'premium',
    language: 'multilingual',
    isActive: true,
    notes: 'Интеграция с Google сервисами',
    cost: {
      input: 306,
      output: 2448,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    model: 'gemini-2.5-flash',
    description: 'Быстрая модель с очень длинными контекстами',
    maxTokens: 1000000,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Для длинных документов и быстрых ответов',
    cost: {
      input: 73.44,
      output: 612,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gemini-2.5-flash-lite': {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    provider: 'Google',
    model: 'gemini-2.5-flash-lite',
    description: 'Облегченная версия Gemini 2.5 Flash',
    maxTokens: 1000000,
    temperature: 0.7,
    category: 'economy',
    language: 'multilingual',
    isActive: true,
    notes: 'Самая экономичная версия Gemini 2.5',
    cost: {
      input: 24.48,
      output: 122.40,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    model: 'gemini-2.0-flash',
    description: 'Gemini 2.0 Flash для быстрых задач',
    maxTokens: 1000000,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Быстрая модель Gemini 2.0',
    cost: {
      input: 24.48,
      output: 97.92,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gemini-2.0-flash-lite': {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash Lite',
    provider: 'Google',
    model: 'gemini-2.0-flash-lite',
    description: 'Облегченная версия Gemini 2.0 Flash',
    maxTokens: 1000000,
    temperature: 0.7,
    category: 'economy',
    language: 'multilingual',
    isActive: true,
    notes: 'Самая экономичная версия Gemini 2.0',
    cost: {
      input: 18.36,
      output: 73.44,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    model: 'gemini-1.5-pro',
    description: 'Мощная модель с длинным контекстом',
    maxTokens: 1000000,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Отличная для работы с длинными документами',
    cost: {
      input: 856.80,
      output: 1713.60,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    model: 'gemini-1.5-flash',
    description: 'Быстрая и экономичная модель',
    maxTokens: 1000000,
    temperature: 0.7,
    category: 'economy',
    language: 'multilingual',
    isActive: true,
    notes: 'Быстрые ответы по доступной цене',
    cost: {
      input: 18.36,
      output: 73.44,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },

  // DeepSeek модели
  'deepseek-chat': {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    model: 'deepseek-chat',
    description: 'Мощная модель для чата и анализа',
    maxTokens: 32768,
    temperature: 0.7,
    category: 'standard',
    language: 'multilingual',
    isActive: true,
    notes: 'Отличная для технических и аналитических задач',
    cost: {
      input: 66.10,
      output: 269.28,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  },
  'deepseek-coder': {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    model: 'deepseek-reasoner',
    description: 'Специализированная модель для программирования',
    maxTokens: 16384,
    temperature: 0.7,
    category: 'specialized',
    language: 'multilingual',
    isActive: true,
    notes: 'Оптимизирована для генерации и анализа кода',
    cost: {
      input: 134.64,
      output: 536.11,
      currency: 'RUB',
      unit: 'за 1K токенов'
    }
  }
};

/**
 * @type {Object.<string, string[]>}
 * @description Группировка моделей по провайдерам
 */
const MODELS_BY_PROVIDER = {
  OpenAI: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4o-mini-audio', 'gpt-4o-audio'],
  Anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-3-7-sonnet', 'claude-3-5-sonnet', 'claude-3-5-haiku'],
  Google: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  DeepSeek: ['deepseek-chat', 'deepseek-coder']
};

/**
 * @type {Object.<string, string[]>}
 * @description Группировка моделей по категориям
 */
const MODELS_BY_CATEGORY = {
  premium: ['gpt-4o', 'gpt-4-turbo', 'claude-3-opus', 'gemini-2.5-pro', 'gpt-5', 'gpt-4o-audio'],
  standard: ['gpt-4o-mini', 'gpt-4', 'claude-3-sonnet', 'gemini-2.5-flash', 'gpt-5-mini', 'gemini-2.0-flash'],
  economy: ['gpt-3.5-turbo', 'claude-3-haiku', 'gemini-1.5-flash', 'gpt-5-nano', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'],
  specialized: ['deepseek-coder', 'gpt-4o-mini-audio']
};

/**
 * @type {Object.<string, string[]>}
 * @description Группировка моделей по языкам
 */
const MODELS_BY_LANGUAGE = {
  multilingual: [
    'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-5', 'gpt-5-mini', 'gpt-5-nano',
    'gpt-4o-mini-audio', 'gpt-4o-audio', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 
    'claude-3-7-sonnet', 'claude-3-5-sonnet', 'claude-3-5-haiku', 'gemini-2.5-pro', 'gemini-2.5-flash', 
    'gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro', 'gemini-1.5-flash',
    'deepseek-chat', 'deepseek-coder'
  ]
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

  /**
   * @group Cost Analysis
   * @description Получает информацию о стоимости модели
   * @param {string} modelId - ID модели
   * @returns {Object|null} Информация о стоимости или null
   */
  getModelCost(modelId) {
    const model = this.models[modelId];
    return model ? model.cost : null;
  }

  /**
   * @group Cost Analysis
   * @description Рассчитывает примерную стоимость запроса
   * @param {string} modelId - ID модели
   * @param {number} inputTokens - Количество входных токенов
   * @param {number} outputTokens - Количество выходных токенов
   * @returns {Object|null} Расчет стоимости или null
   */
  calculateRequestCost(modelId, inputTokens, outputTokens) {
    const model = this.models[modelId];
    if (!model || !model.cost) return null;

    const inputCost = (inputTokens / 1000) * model.cost.input;
    const outputCost = (outputTokens / 1000) * model.cost.output;
    const totalCost = inputCost + outputCost;

    return {
      modelId,
      modelName: model.name,
      inputTokens,
      outputTokens,
      inputCost: parseFloat(inputCost.toFixed(6)),
      outputCost: parseFloat(outputCost.toFixed(6)),
      totalCost: parseFloat(totalCost.toFixed(6)),
      currency: model.cost.currency,
      unit: model.cost.unit
    };
  }

  /**
   * @group Cost Analysis
   * @description Получает модели, отсортированные по стоимости
   * @param {string} sortBy - Сортировка по 'input', 'output' или 'total'
   * @param {string} order - Порядок сортировки 'asc' или 'desc'
   * @returns {Array} Отсортированный массив моделей
   */
  getModelsByCost(sortBy = 'total', order = 'asc') {
    const modelsArray = Object.values(this.models).filter(m => m.isActive && m.cost);
    
    return modelsArray.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'input':
          aValue = a.cost.input;
          bValue = b.cost.input;
          break;
        case 'output':
          aValue = a.cost.output;
          bValue = b.cost.output;
          break;
        case 'total':
        default:
          aValue = a.cost.input + a.cost.output;
          bValue = b.cost.input + b.cost.output;
          break;
      }
      
      if (order === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }

  /**
   * @group Cost Analysis
   * @description Получает самые экономичные модели
   * @param {number} limit - Количество моделей для возврата
   * @returns {Array} Массив самых экономичных моделей
   */
  getMostEconomicalModels(limit = 5) {
    return this.getModelsByCost('total', 'asc').slice(0, limit);
  }

  /**
   * @group Cost Analysis
   * @description Получает самые дорогие модели
   * @param {number} limit - Количество моделей для возврата
   * @returns {Array} Массив самых дорогих моделей
   */
  getMostExpensiveModels(limit = 5) {
    return this.getModelsByCost('total', 'desc').slice(0, limit);
  }

  /**
   * @group Cost Analysis
   * @description Получает статистику по стоимости
   * @returns {Object} Статистика стоимости моделей
   */
  getCostStats() {
    const activeModels = Object.values(this.models).filter(m => m.isActive && m.cost);
    
    if (activeModels.length === 0) return null;
    
    const costs = activeModels.map(m => ({
      input: m.cost.input,
      output: m.cost.output,
      total: m.cost.input + m.cost.output
    }));
    
    const avgInput = costs.reduce((sum, c) => sum + c.input, 0) / costs.length;
    const avgOutput = costs.reduce((sum, c) => sum + c.output, 0) / costs.length;
    const avgTotal = costs.reduce((sum, c) => sum + c.total, 0) / costs.length;
    
    const minTotal = Math.min(...costs.map(c => c.total));
    const maxTotal = Math.max(...costs.map(c => c.total));
    
    return {
      totalModels: activeModels.length,
      averageCosts: {
        input: parseFloat(avgInput.toFixed(6)),
        output: parseFloat(avgOutput.toFixed(6)),
        total: parseFloat(avgTotal.toFixed(6))
      },
      costRange: {
        min: parseFloat(minTotal.toFixed(6)),
        max: parseFloat(maxTotal.toFixed(6))
      },
      currency: 'RUB',
      unit: 'за 1K токенов'
    };
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
