/**
 * @fileoverview Обработчик текстовых сообщений Telegram бота
 * @description Обрабатывает текстовые сообщения пользователей с использованием умного роутера и LLM классификации
 * @author Telegram Bot Team
 * @version 2.0.0
 * @since 2024-01-01
 * @requires ../modules
 * @requires ../config/llm
 */

const { SmartRouter } = require('../modules');
const llmConfig = require('../config/llm');

/**
 * @typedef {Object} TextMessage
 * @property {number} chat.id - ID чата
 * @property {string} text - Текст сообщения
 * @property {Object} from - Информация об отправителе
 */

/**
 * @class TextMessageHandler
 * @description Класс для обработки текстовых сообщений пользователей с LLM классификацией
 * @example
 * const textHandler = new TextMessageHandler(bot);
 * if (textHandler.canHandle(message)) {
 *   textHandler.handleTextMessage(message);
 * }
 */
class TextMessageHandler {
  /**
   * @constructor
   * @param {Object} bot - Экземпляр Telegram бота
   * @throws {Error} Если экземпляр бота не передан
   */
  constructor(bot) {
    if (!bot) {
      throw new Error('Экземпляр бота обязателен для TextMessageHandler');
    }
    
    this.bot = bot;
    this.router = null;
    this.isInitialized = false;
    
    console.log('🔧 TextMessageHandler инициализирован');
  }

  /**
   * @group Initialization
   * @description Инициализирует обработчик и умный роутер
   * @returns {Promise<boolean>} true если инициализация успешна
   */
  async initialize() {
    try {
      console.log('🚀 Инициализация TextMessageHandler...');
      
      // Создаем конфигурацию для LLM
      const llmServiceConfig = this.buildLLMConfig();
      
      // Инициализируем умный роутер
      this.router = new SmartRouter(llmServiceConfig, {
        enableLLMClassification: true,
        fallbackToPatterns: true,
        confidenceThreshold: 0.7
      });
      
      // Инициализируем роутер
      await this.router.initialize();
      
      this.isInitialized = true;
      console.log('✅ TextMessageHandler успешно инициализирован');
      
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка инициализации TextMessageHandler:', error);
      
      // Создаем fallback роутер без LLM
      this.createFallbackRouter();
      return false;
    }
  }

  /**
   * @group Configuration
   * @description Строит конфигурацию для LLM сервиса
   * @returns {Object} Конфигурация LLM
   * @private
   */
  buildLLMConfig() {
    const provider = process.env.LLM_PROVIDER || llmConfig.defaultProvider;
    const providerConfig = llmConfig.providers[provider];
    
    if (!providerConfig) {
      throw new Error(`Неизвестный LLM провайдер: ${provider}`);
    }
    
    // Получаем API ключ из переменных окружения
    const apiKey = this.getAPIKey(provider);
    
    return {
      apiKey: apiKey,
      apiUrl: providerConfig.apiUrl,
      model: providerConfig.model,
      maxTokens: providerConfig.maxTokens,
      temperature: providerConfig.temperature,
      timeout: providerConfig.timeout
    };
  }

  /**
   * @group Configuration
   * @description Получает API ключ для указанного провайдера
   * @param {string} provider - Название провайдера
   * @returns {string} API ключ
   * @private
   */
  getAPIKey(provider) {
    const keyMap = {
      'proxyApi': process.env.PROXYAPI_KEY
    };
    
    const apiKey = keyMap[provider];
    
    if (!apiKey) {
      throw new Error(`API ключ для провайдера ${provider} не найден в переменных окружения`);
    }
    
    return apiKey;
  }

  /**
   * @group Fallback Configuration
   * @description Создает fallback роутер без LLM
   * @private
   */
  createFallbackRouter() {
    try {
      console.log('⚠️ Создаю fallback роутер без LLM...');
      
      // Создаем простой роутер с отключенной LLM классификацией
      this.router = new SmartRouter({
        apiKey: 'fallback-key',
        apiUrl: process.env.PROXYAPI_URL || 'https://api.proxyapi.com/v1',
        model: process.env.PROXYAPI_MODEL || 'gpt-3.5-turbo',
        maxTokens: parseInt(process.env.PROXYAPI_MAX_TOKENS) || 1000,
        temperature: parseFloat(process.env.PROXYAPI_TEMPERATURE) || 0.7,
        timeout: parseInt(process.env.PROXYAPI_TIMEOUT) || 30000
      }, {
        enableLLMClassification: false,  // Отключаем LLM классификацию
        fallbackToPatterns: true,        // Включаем паттерн-матчинг
        confidenceThreshold: 0.5
      });
      
      // Инициализируем fallback роутер
      this.router.initialize().then(() => {
        console.log('✅ Fallback роутер успешно инициализирован');
        this.isInitialized = true;
      }).catch(error => {
        console.warn('⚠️ Fallback роутер не может быть инициализирован:', error.message);
        // Создаем еще более простой роутер
        this.createSimpleRouter();
      });
      
    } catch (error) {
      console.error('❌ Ошибка создания fallback роутера:', error);
      // Создаем еще более простой роутер
      this.createSimpleRouter();
    }
  }

  /**
   * @group Fallback Configuration
   * @description Создает максимально простой роутер без внешних зависимостей
   * @private
   */
  createSimpleRouter() {
    try {
      console.log('🔄 Создаю максимально простой роутер...');
      
      // Создаем простой объект-роутер с базовой функциональностью
      this.router = {
        name: 'Simple Fallback Router',
        isReady: () => true,
        processText: async (text, context) => {
          console.log('📝 Простой роутер обрабатывает текст:', text);
          
          // Простые правила без LLM
          if (/(привет|здравствуй|hi|hello)/i.test(text)) {
            return 'Привет! Я простой бот без LLM. Чем могу помочь?';
          }
          
          if (/(как дела|как ты|how are you)/i.test(text)) {
            return 'Спасибо, у меня все хорошо! Я работаю в простом режиме.';
          }
          
          if (/(спасибо|благодарю|thanks)/i.test(text)) {
            return 'Пожалуйста! Рад быть полезным.';
          }
          
          return 'Получил ваше сообщение! Я работаю в простом режиме без LLM.';
        }
      };
      
      this.isInitialized = true;
      console.log('✅ Простой роутер создан и готов к работе');
      
    } catch (error) {
      console.error('❌ Ошибка создания простого роутера:', error);
      // В крайнем случае создаем заглушку
      this.createStubRouter();
    }
  }

  /**
   * @group Fallback Configuration
   * @description Создает заглушку роутера в случае полного отказа
   * @private
   */
  createStubRouter() {
    console.log('🆘 Создаю заглушку роутера...');
    
    this.router = {
      name: 'Stub Router',
      isReady: () => true,
      processText: async (text, context) => {
        console.log('📝 Заглушка роутера обрабатывает текст:', text);
        return 'Извините, у меня временные проблемы с обработкой сообщений. Попробуйте позже.';
      }
    };
    
    this.isInitialized = true;
    console.log('✅ Заглушка роутера создана');
  }

  /**
   * @group Message Processing
   * @description Обрабатывает текстовое сообщение пользователя
   * @param {TextMessage} msg - Объект текстового сообщения
   * @returns {Promise<boolean>} true если сообщение обработано, false в противном случае
   */
  async handleTextMessage(msg) {
    try {
      const chatId = msg.chat.id;
      const text = msg.text;
      
      console.log(`📝 Обрабатываю текстовое сообщение от чата ${chatId}: "${text}"`);
      
      // Проверяем, что сообщение не является командой
      if (this.isCommand(text)) {
        console.log('⚠️ Сообщение является командой, пропускаю обработку');
        return false;
      }
      
      // Проверяем инициализацию
      if (!this.isInitialized && this.router) {
        console.log('🔄 Роутер еще инициализируется, ждем...');
        await this.waitForInitialization();
      }
      
      // Обрабатываем текст через умный роутер
      const response = await this.processTextWithRouter(text, msg);
      
      // Отправляем ответ пользователю
      await this.sendResponse(chatId, response);
      
      console.log(`✅ Текстовое сообщение успешно обработано для чата ${chatId}`);
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка обработки текстового сообщения:', error);
      await this.sendErrorMessage(msg.chat.id);
      return false;
    }
  }

  /**
   * @group Message Validation
   * @description Проверяет, может ли обработчик обработать данное сообщение
   * @param {Object} msg - Объект сообщения от Telegram
   * @returns {boolean} true если сообщение можно обработать, false в противном случае
   */
  canHandle(msg) {
    // Проверяем наличие текста и что это не команда
    return msg.text && !this.isCommand(msg.text);
  }

  /**
   * @group Message Validation
   * @description Проверяет, является ли текст командой
   * @param {string} text - Текст сообщения
   * @returns {boolean} true если это команда, false в противном случае
   * @private
   */
  isCommand(text) {
    return text.startsWith('/');
  }

  /**
   * @group Initialization Waiting
   * @description Ждет завершения инициализации роутера
   * @returns {Promise<void>}
   * @private
   */
  async waitForInitialization() {
    const maxWaitTime = 10000; // 10 секунд
    const checkInterval = 100; // 100 мс
    let waitedTime = 0;
    
    while (!this.isInitialized && waitedTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      waitedTime += checkInterval;
    }
    
    if (!this.isInitialized) {
      console.warn('⚠️ Превышено время ожидания инициализации роутера');
    }
  }

  /**
   * @group Text Processing
   * @description Обрабатывает текст через умный роутер
   * @param {string} text - Текст для обработки
   * @param {Object} msg - Объект сообщения
   * @returns {Promise<string>} Ответ от роутера
   * @private
   */
  async processTextWithRouter(text, msg) {
    try {
      if (!this.router) {
        throw new Error('Роутер не инициализирован');
      }
      
      // Проверяем готовность роутера
      if (typeof this.router.isReady === 'function') {
        const routerReady = this.router.isReady();
        console.log(`🔍 Router ready check: ${routerReady}`);
        
        if (!routerReady) {
          console.log('⚠️ Роутер не готов к работе, проверяю детали...');
          console.log('🔍 Router info:', this.router.getInfo ? this.router.getInfo() : 'getInfo not available');
          throw new Error('Роутер не готов к работе');
        }
      } else {
        console.log('⚠️ Роутер не имеет метода isReady');
      }
      
      // Создаем контекст для классификации
      const context = this.buildMessageContext(msg);
      
      // Обрабатываем текст через роутер
      const response = await this.router.processText(text, context);
      
      if (!response) {
        throw new Error('Роутер не вернул ответ');
      }
      
      return response;
      
    } catch (error) {
      console.error('❌ Ошибка обработки текста через роутер:', error);
      
      // Если роутер не работает, возвращаем fallback ответ
      return this.getDefaultResponse(text);
    }
  }

  /**
   * @group Context Building
   * @description Строит контекст сообщения для LLM классификации
   * @param {Object} msg - Объект сообщения
   * @returns {Object} Контекст для классификации
   * @private
   */
  buildMessageContext(msg) {
    const context = {
      timestamp: new Date().toISOString(),
      chatType: msg.chat.type,
      userId: msg.from?.id,
      username: msg.from?.username,
      firstName: msg.from?.first_name,
      lastName: msg.from?.last_name
    };
    
    // Добавляем историю пользователя если доступна
    if (this.userHistory && this.userHistory[msg.from?.id]) {
      context.userHistory = this.userHistory[msg.from?.id].slice(-5); // Последние 5 сообщений
    }
    
    return context;
  }

  /**
   * @group Response Handling
   * @description Отправляет ответ пользователю
   * @param {number} chatId - ID чата
   * @param {string} response - Текст ответа
   * @returns {Promise<void>}
   * @private
   */
  async sendResponse(chatId, response) {
    try {
      await this.bot.sendMessage(chatId, response, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
      
      console.log(`📤 Ответ отправлен в чат ${chatId}`);
      
    } catch (error) {
      console.error('❌ Ошибка отправки ответа:', error);
      throw error;
    }
  }

  /**
   * @group Error Handling
   * @description Отправляет сообщение об ошибке
   * @param {number} chatId - ID чата
   * @returns {Promise<void>}
   * @private
   */
  async sendErrorMessage(chatId) {
    try {
      const errorMessage = '❌ Произошла ошибка при обработке вашего сообщения. Попробуйте позже.';
      await this.bot.sendMessage(chatId, errorMessage);
    } catch (sendError) {
      console.error('❌ Не удалось отправить сообщение об ошибке:', sendError);
    }
  }

  /**
   * @group Fallback Responses
   * @description Возвращает стандартный ответ если роутер не сработал
   * @param {string} text - Исходный текст пользователя
   * @returns {string} Стандартный ответ
   * @private
   */
  getDefaultResponse(text) {
    return `📝 Вы написали: "<b>${this.escapeHtml(text)}</b>"\n\n` +
           `💡 Это стандартный ответ. Умный роутер временно недоступен.`;
  }

  /**
   * @group Utility Methods
   * @description Экранирует HTML-символы в тексте
   * @param {string} text - Текст для экранирования
   * @returns {string} Экранированный текст
   * @private
   */
  escapeHtml(text) {
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    
    return text.replace(/[&<>"']/g, match => htmlEscapes[match]);
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о модуле роутера
   * @returns {Object} Информация о модуле
   */
  getModuleInfo() {
    try {
      if (this.router) {
        return this.router.getInfo();
      }
      
      return {
        name: 'Неизвестный модуль',
        description: 'Информация недоступна',
        version: '0.0.0'
      };
    } catch (error) {
      console.error('❌ Ошибка получения информации о модуле:', error);
      return {
        name: 'Неизвестный модуль',
        description: 'Информация недоступна',
        version: '0.0.0'
      };
    }
  }

  /**
   * @group Accessors
   * @description Возвращает статистику обработки сообщений
   * @returns {Object} Статистика обработчика
   */
  getStats() {
    const stats = {
      handlerName: 'TextMessageHandler',
      isInitialized: this.isInitialized,
      canHandleCommands: false,
      supportsHtml: true
    };
    
    if (this.router) {
      try {
        const routerStats = this.router.getStats();
        const classifierInfo = this.router.getClassifierInfo();
        const llmInfo = this.router.getLLMInfo();
        
        stats.router = {
          ...routerStats,
          classifier: classifierInfo,
          llm: llmInfo
        };
      } catch (error) {
        console.warn('⚠️ Не удалось получить статистику роутера:', error.message);
        stats.router = 'Статистика недоступна';
      }
    }
    
    return stats;
  }

  /**
   * @group Accessors
   * @description Возвращает статус инициализации
   * @returns {boolean} true если обработчик инициализирован
   */
  isReady() {
    return this.isInitialized && this.router !== null;
  }
}

module.exports = TextMessageHandler;
