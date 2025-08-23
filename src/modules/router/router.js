/**
 * @fileoverview Умный роутер сообщений с LLM классификацией
 * @description Классифицирует и маршрутизирует сообщения с помощью LLM для определения оптимального способа обработки
 * @author Telegram Bot Team
 * @version 2.0.0
 * @since 2024-01-01
 * @requires ../services/llm/llmService
 * @requires ../classifier/messageClassifier
 */

const LLMService = require('../../services/llm/llmService');
const MessageClassifier = require('../classifier/messageClassifier');

/**
 * @typedef {Object} RouteRule
 * @property {string} id - Уникальный идентификатор правила
 * @property {string|RegExp} pattern - Паттерн для сопоставления
 * @property {Function} handler - Функция-обработчик
 * @property {string} description - Описание правила
 * @property {number} priority - Приоритет правила (1-10)
 * @property {string} category - Категория сообщения
 * @property {Object} metadata - Дополнительные метаданные
 */

/**
 * @typedef {Object} RouterStats
 * @property {number} totalRequests - Общее количество запросов
 * @property {number} classifiedRequests - Количество классифицированных запросов
 * @property {number} fallbackRequests - Количество запросов с fallback
 * @property {Object} categoryStats - Статистика по категориям
 * @property {Date} lastRequest - Время последнего запроса
 */

/**
 * @class SmartRouter
 * @description Умный роутер, использующий LLM для классификации и маршрутизации сообщений
 * @example
 * const router = new SmartRouter(llmConfig);
 * await router.initialize();
 * const response = await router.processText('Привет, как дела?');
 */
class SmartRouter {
  /**
   * @constructor
   * @param {Object} llmConfig - Конфигурация LLM сервиса
   * @param {Object} [options] - Дополнительные опции
   * @throws {Error} Если конфигурация LLM неверна
   */
  constructor(llmConfig, options = {}) {
    this.name = 'Smart Router Module';
    this.version = '2.0.0';
    this.options = {
      enableLLMClassification: true,
      fallbackToPatterns: true,
      confidenceThreshold: 0.7,
      ...options
    };
    
    // Инициализируем LLM сервис
    this.llmService = new LLMService(llmConfig);
    
    // Инициализируем классификатор
    this.classifier = new MessageClassifier(this.llmService);
    
    // Правила роутинга
    this.routes = [];
    this.stats = this.initializeStats();
    
    console.log('🔧 SmartRouter инициализирован');
  }

  /**
   * @group Statistics Initialization
   * @description Инициализирует статистику роутера
   * @returns {RouterStats} Начальная статистика
   * @private
   */
  initializeStats() {
    return {
      totalRequests: 0,
      classifiedRequests: 0,
      fallbackRequests: 0,
      categoryStats: {},
      lastRequest: null
    };
  }

  /**
   * @group Initialization
   * @description Инициализирует роутер и все зависимые сервисы
   * @returns {Promise<boolean>} true если инициализация успешна
   */
  async initialize() {
    try {
      console.log('🚀 Инициализация SmartRouter...');
      
      // Инициализируем LLM сервис только если включена LLM классификация
      if (this.options.enableLLMClassification) {
        try {
          await this.llmService.initialize();
          await this.classifier.initialize();
          console.log('✅ LLM сервис и классификатор инициализированы');
        } catch (llmError) {
          console.warn('⚠️ LLM инициализация не удалась, отключаю LLM классификацию:', llmError.message);
          this.options.enableLLMClassification = false;
        }
      } else {
        console.log('ℹ️ LLM классификация отключена, используем только паттерн-маршрутизацию');
      }
      
      // Добавляем базовые правила
      this.initializeDefaultRoutes();
      
      console.log(`✅ SmartRouter успешно инициализирован. Правил: ${this.routes.length}, LLM: ${this.options.enableLLMClassification}`);
      console.log(`🔍 Router isReady after init: ${this.isReady()}`);
      
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка инициализации SmartRouter:', error);
      throw error;
    }
  }

  /**
   * @group Default Routes
   * @description Инициализирует базовые правила роутинга
   * @private
   */
  initializeDefaultRoutes() {
    console.log('🔧 Инициализация базовых правил роутинга...');
    
    // Правило для приветствий
    this.addRoute({
      id: 'greeting',
      pattern: /(привет|здравствуй|hi|hello)/i,
      handler: (text) => this.generateGreetingResponse(text),
      description: 'Приветствие',
      priority: 1,
      category: 'greeting'
    });

    // Правило для вопросов
    this.addRoute({
      id: 'question',
      pattern: /(как дела|как ты|как жизнь|how are you)/i,
      handler: (text) => this.generateStatusResponse(text),
      description: 'Вопрос о состоянии',
      priority: 2,
      category: 'question'
    });

    // Правило для благодарности
    this.addRoute({
      id: 'thanks',
      pattern: /(спасибо|благодарю|thanks|thank you)/i,
      handler: (text) => this.generateThanksResponse(text),
      description: 'Благодарность',
      priority: 1,
      category: 'feedback'
    });

    console.log(`✅ Базовые правила роутинга добавлены. Всего правил: ${this.routes.length}`);
  }

  /**
   * @group Route Management
   * @description Добавляет новое правило роутинга
   * @param {RouteRule} route - Правило для добавления
   */
  addRoute(route) {
    if (!route.id || !route.handler || typeof route.handler !== 'function') {
      throw new Error('Правило должно иметь id и handler функцию');
    }

    const newRoute = {
      id: route.id,
      pattern: route.pattern,
      handler: route.handler,
      description: route.description || 'Неописанное правило',
      priority: route.priority || 0,
      category: route.category || 'general',
      metadata: route.metadata || {},
      createdAt: new Date()
    };

    this.routes.push(newRoute);
    
    // Сортируем правила по приоритету (высокий приоритет сначала)
    this.routes.sort((a, b) => b.priority - a.priority);
    
    console.log(`✅ Правило "${newRoute.description}" добавлено с приоритетом ${newRoute.priority}`);
  }

  /**
   * @group Text Processing
   * @description Обрабатывает текстовое сообщение через умную маршрутизацию
   * @param {string} text - Текст для обработки
   * @param {Object} [context] - Контекст разговора
   * @returns {Promise<string>} Ответ от подходящего обработчика
   */
  async processText(text, context = {}) {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Текст должен быть непустой строкой');
      }

      // Обновляем статистику
      this.updateStats();
      
      console.log(`📝 Обрабатываю текст: "${text}"`);
      
      let response = null;
      
      // Пытаемся использовать LLM классификацию
      if (this.options.enableLLMClassification && this.classifier && typeof this.classifier.isReady === 'function' && this.classifier.isReady()) {
        try {
          response = await this.processWithLLMClassification(text, context);
          if (response) {
            this.stats.classifiedRequests++;
            console.log('✅ Сообщение обработано через LLM классификацию');
            return response;
          }
        } catch (error) {
          console.warn('⚠️ LLM классификация не удалась, использую fallback:', error.message);
        }
      }
      
      // Fallback на паттерн-матчинг
      if (this.options.fallbackToPatterns) {
        response = await this.processWithPatternMatching(text);
        if (response) {
          this.stats.fallbackRequests++;
          console.log('✅ Сообщение обработано через паттерн-матчинг');
          return response;
        }
      }
      
      // Если ничего не подошло, используем обработчик по умолчанию
      console.log('⚠️ Подходящее правило не найдено, использую обработчик по умолчанию');
      return this.getDefaultResponse(text);
      
    } catch (error) {
      console.error('❌ Ошибка обработки текста:', error);
      return this.getErrorResponse(error);
    }
  }

  /**
   * @group LLM Classification Processing
   * @description Обрабатывает текст с помощью LLM классификации
   * @param {string} text - Текст для обработки
   * @param {Object} context - Контекст разговора
   * @returns {Promise<string|null>} Ответ или null если не найден
   * @private
   */
  async processWithLLMClassification(text, context) {
    try {
      // Проверяем готовность классификатора
      if (!this.classifier || typeof this.classifier.classifyMessage !== 'function') {
        console.warn('⚠️ Классификатор недоступен для LLM классификации');
        return null;
      }
      
      // Классифицируем сообщение
      const classification = await this.classifier.classifyMessage(text, context);
      
      console.log(`🔍 LLM классификация: ${classification.categoryName} (уверенность: ${classification.confidence})`);
      
      // Проверяем уверенность классификации
      if (classification.confidence < this.options.confidenceThreshold) {
        console.log(`⚠️ Низкая уверенность классификации: ${classification.confidence}`);
        return null;
      }
      
      // Ищем подходящее правило по категории
      const matchingRoute = this.routes.find(route => 
        route.category === classification.categoryId
      );
      
      if (matchingRoute) {
        console.log(`✅ Найдено правило по категории: ${matchingRoute.description}`);
        return await this.executeHandler(matchingRoute, text);
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Ошибка LLM классификации:', error);
      return null;
    }
  }

  /**
   * @group Pattern Matching Processing
   * @description Обрабатывает текст с помощью паттерн-матчинга
   * @param {string} text - Текст для обработки
   * @returns {Promise<string|null>} Ответ или null если не найден
   * @private
   */
  async processWithPatternMatching(text) {
    try {
      // Ищем подходящее правило по паттерну
      const matchingRoute = this.routes.find(route => 
        this.matchesPattern(route.pattern, text)
      );
      
      if (matchingRoute) {
        console.log(`✅ Найдено правило по паттерну: ${matchingRoute.description}`);
        return await this.executeHandler(matchingRoute, text);
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Ошибка паттерн-матчинга:', error);
      return null;
    }
  }

  /**
   * @group Pattern Matching
   * @description Проверяет, соответствует ли текст паттерну
   * @param {string|RegExp} pattern - Паттерн для проверки
   * @param {string} text - Текст для проверки
   * @returns {boolean} true если текст соответствует паттерну
   * @private
   */
  matchesPattern(pattern, text) {
    if (pattern instanceof RegExp) {
      return pattern.test(text);
    } else if (typeof pattern === 'string') {
      return text.toLowerCase().includes(pattern.toLowerCase());
    }
    return false;
  }

  /**
   * @group Handler Execution
   * @description Выполняет обработчик правила
   * @param {RouteRule} route - Правило для выполнения
   * @param {string} text - Исходный текст
   * @returns {Promise<string>} Результат обработки
   * @private
   */
  async executeHandler(route, text) {
    try {
      const result = await route.handler(text);
      
      if (typeof result === 'string') {
        return result;
      } else if (result && typeof result === 'object') {
        return JSON.stringify(result);
      } else {
        return String(result);
      }
      
    } catch (error) {
      console.error(`❌ Ошибка выполнения обработчика "${route.description}":`, error);
      throw error;
    }
  }

  /**
   * @group Response Generation
   * @description Генерирует ответ на приветствие
   * @param {string} text - Исходный текст
   * @returns {string} Ответ на приветствие
   * @private
   */
  generateGreetingResponse(text) {
    const greetings = [
      'Привет! 👋 Как дела?',
      'Здравствуйте! 😊 Рад вас видеть!',
      'Приветствую! 🎉 Чем могу помочь?',
      'Добрый день! ☀️ Как ваши дела?'
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * @group Response Generation
   * @description Генерирует ответ на вопрос о состоянии
   * @param {string} text - Исходный текст
   * @returns {string} Ответ о состоянии
   * @private
   */
  generateStatusResponse(text) {
    const responses = [
      'У меня все отлично! 😊 Спасибо, что спросили!',
      'Все хорошо! 🚀 Готов помогать и общаться!',
      'Прекрасно! ✨ Как у вас дела?',
      'Отлично! 🌟 Работаю без сбоев!'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * @group Response Generation
   * @description Генерирует ответ на благодарность
   * @param {string} text - Исходный текст
   * @returns {string} Ответ на благодарность
   * @private
   */
  generateThanksResponse(text) {
    const responses = [
      'Пожалуйста! 😊 Рад быть полезным!',
      'Не за что! 🌟 Всегда к вашим услугам!',
      'Обращайтесь! 🎯 Буду рад помочь снова!',
      'Рад стараться! ✨ Спасибо за обращение!'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
           `💡 Это стандартный ответ умного роутера. ` +
           `Попробуйте переформулировать ваше сообщение.`;
  }

  /**
   * @group Error Handling
   * @description Генерирует ответ об ошибке
   * @param {Error} error - Объект ошибки
   * @returns {string} Сообщение об ошибке
   * @private
   */
  getErrorResponse(error) {
    return `❌ Произошла ошибка при обработке вашего сообщения:\n` +
           `🔍 ${error.message}\n\n` +
           `💡 Попробуйте позже или обратитесь к администратору.`;
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
   * @group Statistics Management
   * @description Обновляет статистику роутера
   * @private
   */
  updateStats() {
    this.stats.totalRequests++;
    this.stats.lastRequest = new Date();
  }

  /**
   * @group Accessors
   * @description Проверяет готовность роутера к работе
   * @returns {boolean} true если роутер готов, false в противном случае
   */
  isReady() {
    // Роутер готов если есть базовые правила
    const hasRoutes = this.routes.length > 0;
    
    // Если LLM классификация отключена, роутер готов
    if (!this.options.enableLLMClassification) {
      console.log(`🔍 Router isReady: hasRoutes=${hasRoutes}, LLM disabled`);
      return hasRoutes;
    }
    
    // Если LLM классификация включена, проверяем готовность компонентов
    const llmReady = this.llmService && this.llmService.isReady();
    const classifierReady = this.classifier && typeof this.classifier.isReady === 'function' && this.classifier.isReady();
    
    console.log(`🔍 Router isReady: hasRoutes=${hasRoutes}, llmReady=${llmReady}, classifierReady=${classifierReady}`);
    
    // Роутер готов если есть правила и либо LLM недоступен (будет fallback), либо все компоненты готовы
    const result = hasRoutes && (llmReady || !this.options.enableLLMClassification);
    console.log(`🔍 Router isReady result: ${result}`);
    
    return result;
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о роутере
   * @returns {Object} Информация о роутере
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      isReady: this.isReady(),
      options: this.options,
      routesCount: this.routes.length,
      stats: this.stats
    };
  }

  /**
   * @group Accessors
   * @description Возвращает статистику роутера
   * @returns {RouterStats} Статистика роутера
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * @group Accessors
   * @description Возвращает список всех правил
   * @returns {Array<RouteRule>} Массив правил
   */
  getRoutes() {
    return this.routes.map(route => ({
      ...route,
      createdAt: route.createdAt.toISOString()
    }));
  }

  /**
   * @group Accessors
   * @description Возвращает количество правил
   * @returns {number} Количество правил
   */
  getRoutesCount() {
    return this.routes.length;
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о классификаторе
   * @returns {Object} Информация о классификаторе
   */
  getClassifierInfo() {
    return this.classifier.getInfo();
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о LLM сервисе
   * @returns {Object} Информация о LLM сервисе
   */
  getLLMInfo() {
    return this.llmService.getInfo();
  }

  /**
   * @group Accessors
   * @description Очищает все правила роутинга
   */
  clearRoutes() {
    this.routes = [];
    console.log('🗑️ Все правила роутинга очищены');
  }
}

module.exports = SmartRouter;
