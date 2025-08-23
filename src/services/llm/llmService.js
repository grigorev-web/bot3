/**
 * @fileoverview Сервис для работы с LLM (Large Language Models)
 * @description Обеспечивает взаимодействие с ProxyAPI для классификации и обработки текста
 * @author Telegram Bot Team
 * @version 2.0.0
 * @since 2024-01-01
 */

// Полифилл для fetch в Node.js
if (typeof fetch === 'undefined') {
  try {
    const fetchPolyfill = require('node-fetch');
    global.fetch = fetchPolyfill;
    console.log('🔧 Используется полифилл node-fetch');
  } catch (error) {
    console.warn('⚠️ node-fetch не установлен, используйте Node.js 18+ или установите node-fetch');
  }
}

/**
 * @typedef {Object} LLMConfig
 * @property {string} apiKey - API ключ для доступа к ProxyAPI
 * @property {string} apiUrl - URL API сервиса ProxyAPI
 * @property {string} model - Модель для использования
 * @property {number} maxTokens - Максимальное количество токенов
 * @property {number} temperature - Температура генерации (0.0 - 1.0)
 * @property {number} timeout - Таймаут запроса в миллисекундах
 */

/**
 * @typedef {Object} LLMRequest
 * @property {string} prompt - Текст запроса
 * @property {string} [systemPrompt] - Системный промпт
 * @property {Array<Object>} [context] - Контекст разговора
 * @property {Object} [options] - Дополнительные опции
 */

/**
 * @typedef {Object} LLMResponse
 * @property {string} content - Содержимое ответа
 * @property {Object} metadata - Метаданные ответа
 * @property {number} tokensUsed - Количество использованных токенов
 * @property {number} processingTime - Время обработки в миллисекундах
 */

/**
 * @class LLMService
 * @description Основной сервис для работы с ProxyAPI
 * @example
 * const llmService = new LLMService(config);
 * const response = await llmService.generateResponse('Классифицируй это сообщение');
 */
class LLMService {
  /**
   * @constructor
   * @param {LLMConfig} [config] - Конфигурация LLM сервиса (опционально)
   * @throws {Error} Если конфигурация неверна
   */
  constructor(config = null) {
    // Если конфигурация не передана, читаем из переменных окружения
    if (!config) {
      config = this.readConfigFromEnv();
    }
    
    this.validateConfig(config);
    this.config = { ...config };
    this.isInitialized = false;
    this.apiAvailable = false;
    
    console.log('🔧 LLMService инициализирован');
  }

  /**
   * @group Configuration
   * @description Валидирует конфигурацию LLM сервиса
   * @param {LLMConfig} config - Конфигурация для валидации
   * @throws {Error} Если конфигурация неверна
   * @private
   */
  validateConfig(config) {
    if (!config.apiKey) {
      throw new Error('API ключ обязателен для LLM сервиса');
    }
    
    if (!config.apiUrl) {
      throw new Error('URL API обязателен для LLM сервиса');
    }
    
    if (!config.model) {
      throw new Error('Модель LLM обязательна');
    }
    
    // Устанавливаем значения по умолчанию
    if (!config.maxTokens) config.maxTokens = 1000;
    if (!config.temperature) config.temperature = 0.7;
    if (!config.timeout) config.timeout = 30000;
  }

  /**
   * @group Configuration
   * @description Читает конфигурацию из переменных окружения
   * @returns {LLMConfig} Конфигурация LLM
   * @private
   */
  readConfigFromEnv() {
    const provider = process.env.LLM_PROVIDER || 'proxyApi';
    
    // Определяем провайдера из модели
    const model = process.env.PROXYAPI_MODEL || 'gpt-3.5-turbo';
    const modelProvider = this.getProviderFromModel(model);
    
    const config = {
      apiKey: process.env.PROXYAPI_KEY,
      apiUrl: process.env.PROXYAPI_BASE_URL || 'https://api.proxyapi.ru',
      model: model,
      modelProvider: modelProvider,
      maxTokens: parseInt(process.env.PROXYAPI_MAX_TOKENS) || 1000,
      temperature: parseFloat(process.env.PROXYAPI_TEMPERATURE) || 0.7,
      timeout: parseInt(process.env.PROXYAPI_TIMEOUT) || 30000
    };
    
    console.log(`🔧 LLM конфигурация загружена: провайдер=${provider}, модель=${config.model}, URL=${config.apiUrl}/${config.modelProvider}/v1`);
    
    return config;
  }

  /**
   * @group Configuration
   * @description Определяет провайдера из названия модели
   * @param {string} model - Название модели
   * @returns {string} Название провайдера
   * @private
   */
  getProviderFromModel(model) {
    if (model.startsWith('gpt-') || model.startsWith('o') || model.startsWith('dall-e') || model.startsWith('whisper') || model.startsWith('tts') || model.startsWith('text-embedding')) {
      return 'openai';
    } else if (model.startsWith('claude-') || model.startsWith('anthropic/')) {
      return 'anthropic';
    } else if (model.startsWith('gemini-') || model.startsWith('google/')) {
      return 'google';
    } else if (model.startsWith('deepseek-')) {
      return 'deepseek';
    } else {
      // По умолчанию OpenAI
      return 'openai';
    }
  }

  /**
   * @group Initialization
   * @description Инициализирует LLM сервис
   * @returns {Promise<boolean>} true если инициализация успешна
   */
  async initialize() {
    try {
      console.log('🚀 Инициализация LLM сервиса...');
      
      // Проверяем доступность API
      const connectionTest = await this.testConnection();
      
      if (connectionTest) {
        this.isInitialized = true;
        console.log('✅ LLM сервис успешно инициализирован');
      } else {
        console.warn('⚠️ LLM сервис инициализирован в режиме fallback (без API)');
        // Устанавливаем флаг инициализации даже при неудачном тесте
        this.isInitialized = true;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Ошибка инициализации LLM сервиса:', error);
      // В случае ошибки все равно устанавливаем флаг
      this.isInitialized = true;
      return false;
    }
  }

  /**
   * @group Connection Testing
   * @description Тестирует соединение с LLM API
   * @returns {Promise<boolean>} true если соединение установлено
   * @private
   */
  async testConnection() {
    try {
      console.log('🔍 Тестирую соединение с LLM API...');
      
      // Создаем простой тестовый запрос
      const testRequest = {
        prompt: 'Тест соединения',
        systemPrompt: 'Ты - тестовый бот. Ответь одним словом: "OK"',
        context: [],
        options: {
          maxTokens: 5,
          temperature: 0.1,
          timeout: 10000
        }
      };
      
      // Прямой вызов API без проверки инициализации
      const testResponse = await this.callLLMAPI(testRequest);
      
      if (testResponse && testResponse.content) {
        console.log('✅ Соединение с LLM API установлено');
        console.log('📝 Тестовый ответ:', testResponse.content);
        this.apiAvailable = true;
        return true;
      } else {
        throw new Error('Пустой ответ от LLM API');
      }
      
    } catch (error) {
      console.warn('⚠️ Тест соединения не удался:', error.message);
      this.apiAvailable = false;
      // Не бросаем ошибку, просто возвращаем false
      return false;
    }
  }

  /**
   * @group Text Generation
   * @description Генерирует ответ с помощью LLM
   * @param {string} prompt - Текст запроса
   * @param {Object} [options] - Дополнительные опции
   * @returns {Promise<LLMResponse>} Ответ от LLM
   */
  async generateResponse(prompt, options = {}) {
    if (!this.isInitialized) {
      throw new Error('LLM сервис не инициализирован. Вызовите initialize()');
    }

    try {
      const startTime = Date.now();
      
      const request = this.buildRequest(prompt, options);
      const response = await this.callLLMAPI(request);
      
      const processingTime = Date.now() - startTime;
      
      return {
        content: response.content,
        metadata: {
          model: this.config.model,
          prompt: prompt,
          options: options
        },
        tokensUsed: response.tokensUsed || 0,
        processingTime: processingTime
      };
      
    } catch (error) {
      console.error('❌ Ошибка генерации ответа LLM:', error);
      throw error;
    }
  }

  /**
   * @group Request Building
   * @description Строит запрос к LLM API
   * @param {string} prompt - Текст запроса
   * @param {Object} options - Дополнительные опции
   * @returns {LLMRequest} Структурированный запрос
   * @private
   */
  buildRequest(prompt, options) {
    return {
      prompt: prompt,
      systemPrompt: options.systemPrompt || this.getDefaultSystemPrompt(),
      context: options.context || [],
      options: {
        maxTokens: options.maxTokens || this.config.maxTokens,
        temperature: options.temperature || this.config.temperature,
        timeout: options.timeout || this.config.timeout
      }
    };
  }

  /**
   * @group System Prompts
   * @description Возвращает системный промпт по умолчанию
   * @returns {string} Системный промпт
   * @private
   */
  getDefaultSystemPrompt() {
    return `Ты - полезный ассистент для классификации и обработки сообщений. 
    Отвечай кратко и по существу. Используй русский язык.`;
  }

  /**
   * @group API Communication
   * @description Выполняет запрос к ProxyAPI
   * @param {LLMRequest} request - Структурированный запрос
   * @returns {Promise<Object>} Ответ от API
   * @private
   */
  async callLLMAPI(request) {
    try {
      console.log('🤖 Отправляю запрос к ProxyAPI...');
      
      // Формируем данные для запроса в формате OpenAI API
      const requestData = {
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: request.systemPrompt || this.getDefaultSystemPrompt()
          },
          {
            role: 'user',
            content: request.prompt
          }
        ],
        max_tokens: request.options.maxTokens,
        temperature: request.options.temperature
      };
      
      // Добавляем контекст, если есть
      if (request.context && request.context.length > 0) {
        request.context.forEach((ctx, index) => {
          if (ctx.role && ctx.content) {
            requestData.messages.splice(-1, 0, {
              role: ctx.role,
              content: ctx.content
            });
          }
        });
      }
      
      console.log('🤖 Данные запроса:', JSON.stringify(requestData, null, 2));
      
      // Рассчитываем примерную стоимость
      const estimatedCost = this.calculateEstimatedCost(requestData);
      console.log(`💰 Примерная стоимость запроса: ${estimatedCost}`);
      
      // Выполняем HTTP запрос к ProxyAPI
      const response = await fetch(this.config.apiUrl + `/${this.config.modelProvider}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(request.options.timeout)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ProxyAPI ошибка ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      
      console.log('🤖 Ответ от ProxyAPI:', JSON.stringify(responseData, null, 2));
      
      // Извлекаем содержимое ответа
      const content = responseData.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Неожиданный формат ответа от ProxyAPI');
      }
      
      // Рассчитываем фактическую стоимость ответа
      const actualCost = this.calculateActualCost(responseData, requestData);
      console.log(`💰 Фактическая стоимость ответа: ${actualCost}`);
      
      return {
        content: content,
        tokensUsed: responseData.usage?.total_tokens || 0
      };
      
    } catch (error) {
      console.error('❌ Ошибка запроса к ProxyAPI:', error.message);
      
      // Возвращаем fallback ответ в случае ошибки
      return {
        content: `Извините, произошла ошибка при обработке запроса: ${error.message}`,
        tokensUsed: 0
      };
    }
  }

  /**
   * @group Cost Calculation
   * @description Рассчитывает примерную стоимость запроса
   * @param {Object} requestData - Данные запроса
   * @returns {string} Стоимость в рублях
   * @private
   */
  calculateEstimatedCost(requestData) {
    const model = requestData.model;
    const maxTokens = requestData.max_tokens || this.config.maxTokens;
    
    // Примерные тарифы согласно документации (за 1M токенов)
    const tariffs = {
      // OpenAI модели
      'gpt-3.5-turbo-0125': { input: 122.40, output: 367.20 },
      'gpt-4o-mini': { input: 36.72, output: 146.88 },
      'gpt-4o': { input: 612.00, output: 2448.00 },
      'o3-mini': { input: 269.28, output: 1077.12 },
      'o3': { input: 576.00, output: 1600.00 },
      
      // Anthropic модели
      'claude-3-5-sonnet-20241022': { input: 734.40, output: 3672.00 },
      'claude-3-5-haiku-20241022': { input: 244.80, output: 1224.00 },
      'claude-3-7-sonnet-20250219': { input: 734.40, output: 3672.00 },
      
      // Google модели
      'gemini-2.0-flash': { input: 24.48, output: 97.92 },
      'gemini-2.0-flash-lite': { input: 18.36, output: 73.44 },
      'gemini-2.5-flash': { input: 73.44, output: 612.00 },
      
      // DeepSeek модели
      'deepseek-chat': { input: 66.10, output: 269.28 },
      'deepseek-reasoner': { input: 134.64, output: 536.11 }
    };
    
    // Находим тариф для модели
    let tariff = null;
    for (const [modelName, modelTariff] of Object.entries(tariffs)) {
      if (model.includes(modelName) || modelName.includes(model)) {
        tariff = modelTariff;
        break;
      }
    }
    
    if (!tariff) {
      // Если модель не найдена, используем средние тарифы
      tariff = { input: 300.00, output: 1200.00 };
      console.log(`⚠️ Тариф для модели ${model} не найден, используем средние значения`);
    }
    
    // Рассчитываем стоимость (примерно)
    const inputTokens = this.estimateInputTokens(requestData);
    const estimatedOutputTokens = Math.min(maxTokens, 100); // Предполагаем 100 токенов ответа
    
    const inputCost = (inputTokens / 1000000) * tariff.input;
    const outputCost = (estimatedOutputTokens / 1000000) * tariff.output;
    const totalCost = inputCost + outputCost;
    
    return `${totalCost.toFixed(4)} ₽ (вход: ${inputCost.toFixed(4)} ₽, выход: ~${outputCost.toFixed(4)} ₽)`;
  }

  /**
   * @group Cost Calculation
   * @description Рассчитывает фактическую стоимость ответа
   * @param {Object} responseData - Данные ответа
   * @param {Object} requestData - Данные запроса
   * @returns {string} Стоимость в рублях
   * @private
   */
  calculateActualCost(responseData, requestData) {
    const model = requestData.model;
    const usage = responseData.usage;
    
    if (!usage) {
      return 'Неизвестно (нет данных об использовании токенов)';
    }
    
    const inputTokens = usage.prompt_tokens || 0;
    const outputTokens = usage.completion_tokens || 0;
    
    // Примерные тарифы согласно документации (за 1M токенов)
    const tariffs = {
      // OpenAI модели
      'gpt-3.5-turbo-0125': { input: 122.40, output: 367.20 },
      'gpt-4o-mini': { input: 36.72, output: 146.88 },
      'gpt-4o': { input: 612.00, output: 2448.00 },
      'o3-mini': { input: 269.28, output: 1077.12 },
      'o3': { input: 576.00, output: 1600.00 },
      
      // Anthropic модели
      'claude-3-5-sonnet-20241022': { input: 734.40, output: 3672.00 },
      'claude-3-5-haiku-20241022': { input: 244.80, output: 1224.00 },
      'claude-3-7-sonnet-20250219': { input: 734.40, output: 3672.00 },
      
      // Google модели
      'gemini-2.0-flash': { input: 24.48, output: 97.92 },
      'gemini-2.0-flash-lite': { input: 18.36, output: 73.44 },
      'gemini-2.5-flash': { input: 73.44, output: 612.00 },
      
      // DeepSeek модели
      'deepseek-chat': { input: 66.10, output: 269.28 },
      'deepseek-reasoner': { input: 134.64, output: 536.11 }
    };
    
    // Находим тариф для модели
    let tariff = null;
    for (const [modelName, modelTariff] of Object.entries(tariffs)) {
      if (model.includes(modelName) || modelName.includes(model)) {
        tariff = modelTariff;
        break;
      }
    }
    
    if (!tariff) {
      // Если модель не найдена, используем средние тарифы
      tariff = { input: 300.00, output: 1200.00 };
    }
    
    // Рассчитываем фактическую стоимость
    const inputCost = (inputTokens / 1000000) * tariff.input;
    const outputCost = (outputTokens / 1000000) * tariff.output;
    const totalCost = inputCost + outputCost;
    
    return `${totalCost.toFixed(4)} ₽ (вход: ${inputCost.toFixed(4)} ₽, выход: ${outputCost.toFixed(4)} ₽)`;
  }

  /**
   * @group Cost Calculation
   * @description Оценивает количество входных токенов
   * @param {Object} requestData - Данные запроса
   * @returns {number} Примерное количество токенов
   * @private
   */
  estimateInputTokens(requestData) {
    let totalTokens = 0;
    
    // Примерная оценка: 1 токен ≈ 4 символа для русского/английского текста
    requestData.messages.forEach(message => {
      totalTokens += Math.ceil(message.content.length / 4);
    });
    
    // Добавляем системные токены
    totalTokens += 50; // Примерно для системных сообщений
    
    return totalTokens;
  }

  /**
   * @group Utility Methods
   * @description Создает задержку для имитации API
   * @param {number} ms - Время задержки в миллисекундах
   * @returns {Promise<void>}
   * @private
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * @group Accessors
   * @description Возвращает статус инициализации
   * @returns {boolean} true если сервис инициализирован
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * @group Accessors
   * @description Проверяет доступность API
   * @returns {boolean} true если API доступен
   */
  isAPIAvailable() {
    return this.isInitialized && this.apiAvailable;
  }

  /**
   * @group Accessors
   * @description Возвращает конфигурацию сервиса
   * @returns {LLMConfig} Конфигурация (без API ключа)
   */
  getConfig() {
    const safeConfig = { ...this.config };
    delete safeConfig.apiKey; // Не возвращаем API ключ
    return safeConfig;
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о сервисе
   * @returns {Object} Информация о сервисе
   */
  getInfo() {
    return {
      name: 'ProxyAPI Service',
      version: '2.0.0',
      isReady: this.isInitialized,
      isAPIAvailable: this.apiAvailable,
      model: this.config.model,
      apiUrl: this.config.apiUrl
    };
  }
}

module.exports = LLMService;
