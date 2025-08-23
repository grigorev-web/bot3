/**
 * @fileoverview Простой роутер с LLM
 * @description Создает LLM сервис, делает запрос и возвращает ответ
 * @author Telegram Bot Team
 * @version 4.0.0
 * @since 2024-01-01
 */

/**
 * @class SimpleRouter
 * @description Простой роутер, который использует LLM для обработки сообщений
 * @example
 * const router = new SimpleRouter();
 * const response = await router.processText('Привет');
 */
class SimpleRouter {
  /**
   * @constructor
   */
  constructor() {
    this.llmService = null;
    console.log('🔧 SimpleRouter инициализирован');
  }

  /**
   * @group Text Processing
   * @description Обрабатывает текстовое сообщение через LLM
   * @param {string} text - Текст для обработки
   * @returns {Promise<string>} Ответ от LLM
   */
  async processText(text) {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Текст должен быть непустой строкой');
      }

      console.log(`📝 Обрабатываю текст через LLM: "${text}"`);
      
      // Создаем LLM сервис если его нет
      if (!this.llmService) {
        this.llmService = await this.createLLMService();
      }
      
      if (this.llmService) {
        // Делаем запрос к LLM
        const response = await this.llmService.generateResponse(text);
        if (response && response.content) {
          console.log('✅ Получен ответ от LLM');
          return response.content;
        }
      }
      
      // Fallback если LLM недоступен
      console.log('⚠️ LLM недоступен, использую fallback');
      return this.getDefaultResponse(text);
      
    } catch (error) {
      console.error('❌ Ошибка обработки текста:', error);
      return this.getErrorResponse(error);
    }
  }

  /**
   * @group LLM Service Creation
   * @description Создает LLM сервис
   * @returns {Promise<Object|null>} LLM сервис или null если недоступен
   * @private
   */
  async createLLMService() {
    try {
      console.log('🚀 Создаю LLM сервис...');
      
      // Динамически импортируем LLM сервис
      const { LLMService } = require('../../services');
      
      // Создаем сервис
      const service = new LLMService();
      
      // Инициализируем сервис
      await service.initialize();
      
      console.log('✅ LLM сервис создан и готов к работе');
      return service;
      
    } catch (error) {
      console.warn('⚠️ Не удалось создать LLM сервис:', error.message);
      return null;
    }
  }

  /**
   * @group Fallback Responses
   * @description Возвращает стандартный ответ если LLM недоступен
   * @param {string} text - Исходный текст пользователя
   * @returns {string} Стандартный ответ
   * @private
   */
  getDefaultResponse(text) {
    return `📝 Вы написали: "${text}"\n\n💡 LLM сервис временно недоступен. Попробуйте позже.`;
  }

  /**
   * @group Error Handling
   * @description Генерирует ответ об ошибке
   * @param {Error} error - Объект ошибки
   * @returns {string} Сообщение об ошибке
   * @private
   */
  getErrorResponse(error) {
    return `❌ Произошла ошибка при обработке вашего сообщения:\n🔍 ${error.message}\n\n💡 Попробуйте позже или обратитесь к администратору.`;
  }

  /**
   * @group Accessors
   * @description Проверяет готовность роутера к работе
   * @returns {boolean} true если роутер готов, false в противном случае
   */
  isReady() {
    return this.llmService !== null;
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о роутере
   * @returns {Object} Информация о роутере
   */
  getInfo() {
    return {
      name: 'Simple Router with LLM',
      version: '4.0.0',
      isReady: this.isReady(),
      hasLLM: !!this.llmService
    };
  }
}

module.exports = SimpleRouter;
