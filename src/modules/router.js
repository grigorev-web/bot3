/**
 * @fileoverview Модуль роутинга для обработки текстовых сообщений
 * @description Простой роутер для маршрутизации и обработки текстовых сообщений
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 */

/**
 * @typedef {Object} RouteRule
 * @property {string|RegExp} pattern - Паттерн для сопоставления
 * @property {Function} handler - Функция-обработчик
 * @property {string} description - Описание правила
 * @property {number} priority - Приоритет правила (чем выше, тем приоритетнее)
 */

/**
 * @typedef {Object} RouterStats
 * @property {number} totalRequests - Общее количество запросов
 * @property {number} matchedRequests - Количество совпавших запросов
 * @property {number} unmatchedRequests - Количество несовпавших запросов
 * @property {Date} lastRequest - Время последнего запроса
 */

/**
 * @class Router
 * @description Простой модуль роутинга для обработки текстовых сообщений
 * @example
 * const router = new Router();
 * router.addRule(/привет/i, (text) => 'Привет!', 'Приветствие', 1);
 * const response = await router.processText('Привет, как дела?');
 */
class Router {
  /**
   * @constructor
   * @description Инициализирует роутер с базовыми настройками
   */
  constructor() {
    this.name = 'Text Router Module';
    this.version = '1.0.0';
    this.routes = [];
    this.stats = this.initializeStats();
    this.defaultHandler = this.createDefaultHandler();
    
    // Добавляем базовые правила
    this.initializeDefaultRoutes();
    
    console.log('🔧 Router модуль инициализирован');
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
      matchedRequests: 0,
      unmatchedRequests: 0,
      lastRequest: null
    };
  }

  /**
   * @group Default Routes
   * @description Инициализирует базовые правила роутинга
   * @private
   */
  initializeDefaultRoutes() {
    // Правило для приветствий
    this.addRule(
      /(привет|здравствуй|hi|hello)/i,
      (text) => this.generateGreetingResponse(text),
      'Приветствие',
      1
    );

    // Правило для вопросов
    this.addRule(
      /(как дела|как ты|как жизнь|how are you)/i,
      (text) => this.generateStatusResponse(text),
      'Вопрос о состоянии',
      2
    );

    // Правило для благодарности
    this.addRule(
      /(спасибо|благодарю|thanks|thank you)/i,
      (text) => this.generateThanksResponse(text),
      'Благодарность',
      1
    );

    console.log('✅ Базовые правила роутинга добавлены');
  }

  /**
   * @group Route Management
   * @description Добавляет новое правило роутинга
   * @param {string|RegExp} pattern - Паттерн для сопоставления
   * @param {Function} handler - Функция-обработчик
   * @param {string} description - Описание правила
   * @param {number} [priority=0] - Приоритет правила
   */
  addRule(pattern, handler, description, priority = 0) {
    if (!pattern || typeof handler !== 'function') {
      throw new Error('Паттерн и обработчик обязательны для добавления правила');
    }

    const route = {
      pattern,
      handler,
      description: description || 'Неописанное правило',
      priority: priority || 0,
      createdAt: new Date()
    };

    this.routes.push(route);
    
    // Сортируем правила по приоритету (высокий приоритет сначала)
    this.routes.sort((a, b) => b.priority - a.priority);
    
    console.log(`✅ Правило "${description}" добавлено с приоритетом ${priority}`);
  }

  /**
   * @group Text Processing
   * @description Обрабатывает текстовое сообщение через правила роутинга
   * @param {string} text - Текст для обработки
   * @returns {Promise<string>} Ответ от подходящего обработчика
   */
  async processText(text) {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Текст должен быть непустой строкой');
      }

      // Обновляем статистику
      this.updateStats();
      
      console.log(`📝 Обрабатываю текст: "${text}"`);
      
      // Ищем подходящее правило
      const matchedRoute = this.findMatchingRoute(text);
      
      if (matchedRoute) {
        console.log(`✅ Найдено правило: "${matchedRoute.description}"`);
        this.stats.matchedRequests++;
        
        // Выполняем обработчик
        const response = await this.executeHandler(matchedRoute, text);
        return response || 'Ответ не получен';
      }
      
      // Если правило не найдено, используем обработчик по умолчанию
      console.log('⚠️ Подходящее правило не найдено, использую обработчик по умолчанию');
      this.stats.unmatchedRequests++;
      
      return this.defaultHandler(text);
      
    } catch (error) {
      console.error('❌ Ошибка обработки текста:', error);
      return this.getErrorResponse(error);
    }
  }

  /**
   * @group Route Matching
   * @description Находит подходящее правило для текста
   * @param {string} text - Текст для сопоставления
   * @returns {RouteRule|null} Подходящее правило или null
   * @private
   */
  findMatchingRoute(text) {
    for (const route of this.routes) {
      try {
        if (this.matchesPattern(route.pattern, text)) {
          return route;
        }
      } catch (error) {
        console.error(`❌ Ошибка проверки правила "${route.description}":`, error);
      }
    }
    return null;
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
   * @group Default Handlers
   * @description Создает обработчик по умолчанию
   * @returns {Function} Функция-обработчик по умолчанию
   * @private
   */
  createDefaultHandler() {
    return (text) => {
      return `📝 Вы написали: "${this.escapeHtml(text)}"\n\n` +
             `💡 Это стандартный ответ модуля роутинга.`;
    };
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
   * @group Error Handling
   * @description Генерирует ответ об ошибке
   * @param {Error} error - Объект ошибки
   * @returns {string} Сообщение об ошибке
   * @private
   */
  getErrorResponse(error) {
    return `❌ Произошла ошибка при обработке вашего сообщения:\n` +
           `🔍 ${error.message}\n\n` +
           `💡 Попробуйте переформулировать или обратитесь к администратору.`;
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
   * @description Возвращает информацию о модуле
   * @returns {Object} Информация о модуле
   */
  getInfo() {
    return {
      name: this.name,
      description: 'Простой модуль для обработки текстовых сообщений',
      version: this.version,
      routesCount: this.routes.length,
      stats: this.getStats()
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
   * @description Очищает все правила роутинга
   */
  clearRoutes() {
    this.routes = [];
    console.log('🗑️ Все правила роутинга очищены');
  }
}

module.exports = Router;
