/**
 * @fileoverview Простой роутер с LLM
 * @description Создает LLM сервис, делает запрос и возвращает ответ
 * @author Telegram Bot Team
 * @version 4.1.0
 * @since 2024-01-01
 */

const { LLMService } = require('../../services/llm');
const { Context } = require('../context');
const { Validator } = require('../validator');

class Router {
  constructor(bot, msg) {
    this.bot = bot;
    this.msg = msg;
    this.answer = null;
    this.context = null;
    this.validator = new Validator();
  }

  /**
   * @group Status Updates
   * @description Отправляет статус "бот печатает..." пользователю
   * @private
   */
  async sendTypingStatus() {
    try {
      console.log('⌨️ Отправляю статус "бот печатает..."');
      await this.bot.sendChatAction(this.msg.chat.id, 'typing');
    } catch (error) {
      console.error('❌ Ошибка отправки статуса печати:', error);
    }
  }

  async run() {

    // 0. Отправляем статус "бот пишет..."
    await this.sendTypingStatus();

    // 1. Добавляем контекст (история сообщений и тд)
    this.addContext();

    // 2. Валидируем сообщение
    this.validate();

    // 3. Получаем ответ от LLM
    await this.getAnswerFromLLM();

    // 4. Отправляем ответ пользователю
    await this.sendAnswer();
  }

  /**
   * @group Context Management
   * @description Добавляет контекст к сообщению
   * @private
   */
  addContext() {
    const context = new Context();
    this.context = context.getContext();
    this.msg.context = this.context;
  }

  validate() {
    this.validator.validateTelegramMessage(this.msg);
  }

  /**
   * @group LLM Integration
   * @description Получает ответ от LLM сервиса
   * @private
   */
  async getAnswerFromLLM() {
    try {
      const llmService = new LLMService();
      const response = await llmService.generateResponse(this.msg.text);
      
      if (response && response.content) {
        this.answer = response.content;
        console.log('✅ Получен ответ от LLM');
      } else {
        console.log('⚠️ LLM не дал ответ, использую fallback');
        this.answer = this.getDefaultResponse(this.msg.text);
      }
    } catch (error) {
      console.error('❌ Ошибка получения ответа от LLM:', error);
      this.answer = this.getErrorResponse(error);
    }
  }

  /**
   * @group Response Processing
   * @description Отправляет ответ пользователю через Telegram бота
   * @private
   */
  async sendAnswer() {
    try {
      if (!this.answer) {
        this.answer = this.getDefaultResponse(this.msg.text);
      }
      
      console.log(`📤 Отправляю ответ пользователю ${this.msg.from?.id}: "${this.answer}"`);
      
      // Отправляем сообщение в тот же чат, откуда пришло сообщение
      await this.bot.sendMessage(this.msg.chat.id, this.answer, {
        reply_to_message_id: this.msg.message_id,
        parse_mode: 'HTML'
      });
      
      console.log('✅ Ответ успешно отправлен');
      
    } catch (error) {
      console.error('❌ Ошибка отправки ответа:', error);
      // Пытаемся отправить сообщение об ошибке
      try {
        await this.bot.sendMessage(this.msg.chat.id, 
          '❌ Произошла ошибка при отправке ответа. Попробуйте позже.', {
          reply_to_message_id: this.msg.message_id
        });
      } catch (sendError) {
        console.error('❌ Не удалось отправить сообщение об ошибке:', sendError);
      }
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
