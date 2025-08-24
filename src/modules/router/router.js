/**
 * @fileoverview Простой роутер с LLM
 * @description Создает LLM сервис, делает запрос и возвращает ответ
 * @author Telegram Bot Team
 * @version 4.1.0
 * @since 2024-01-01
 */

const { LLMService } = require('../../services/llm');

class Router {
  constructor(msg) {
    this.msg = msg;
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
      
      // Создаем новый LLM сервис для каждого запроса
      const llmService = new LLMService();
      
      // Делаем запрос к LLM
      const response = await llmService.generateResponse(text);
      if (response && response.content) {
        console.log('✅ Получен ответ от LLM');
        return response.content;
      }
      
      // Fallback если LLM не дал ответ
      console.log('⚠️ LLM не дал ответ, использую fallback');
      return this.getDefaultResponse(text);
      
    } catch (error) {
      console.error('❌ Ошибка обработки текста:', error);
      return this.getErrorResponse(error);
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
   * @description Возвращает сообщение об ошибке
   * @param {Error} error - Объект ошибки
   * @returns {string} Сообщение об ошибке
   * @private
   */
  getErrorResponse(error) {
    return `❌ Произошла ошибка при обработке вашего сообщения:\n🔍 ${error.message}\n\n💡 Попробуйте позже или обратитесь к администратору.`;
  }
}

module.exports = Router;
