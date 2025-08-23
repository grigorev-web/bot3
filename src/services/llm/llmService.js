/**
 * @fileoverview Сервис для работы с LLM (Large Language Models)
 * @description Обеспечивает взаимодействие с ProxyAPI для классификации и обработки текста
 * @author Telegram Bot Team
 * @version 2.0.0
 * @since 2024-01-01
 */

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
   * @param {LLMConfig} config - Конфигурация LLM сервиса
   * @throws {Error} Если конфигурация неверна
   */
  constructor(config) {
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
    // TODO: Реализовать реальный вызов ProxyAPI
    // Пока возвращаем заглушку для разработки
    
    console.log('🤖 ProxyAPI запрос:', JSON.stringify(request, null, 2));
    
    // Имитируем задержку API
    await this.delay(1000);
    
    return {
      content: `Заглушка ProxyAPI ответа на: "${request.prompt}"`,
      tokensUsed: Math.floor(Math.random() * 100) + 50
    };
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
