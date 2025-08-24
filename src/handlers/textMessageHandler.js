/**
 * @fileoverview Обработчик текстовых сообщений Telegram бота
 * @description Обрабатывает текстовые сообщения пользователей через простой роутер
 * @author Telegram Bot Team
 * @version 3.1.0
 * @since 2024-01-01
 */

/**
 * @typedef {Object} TextMessage
 * @property {number} chat.id - ID чата
 * @property {string} text - Текст сообщения
 * @property {Object} from - Информация об отправителе
 */

/**
 * @class TextMessageHandler
 * @description Простой класс для обработки текстовых сообщений через роутер
 */
class TextMessageHandler {
  /**
   * @constructor
   * @param {Object} bot - Экземпляр Telegram бота
   */
  constructor(bot) {
    this.bot = bot;
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
      
      // Обрабатываем текст через роутер
      let response;
      try {
        const { Router } = require('../modules/router');
        const router = new Router();
        
        response = await router.processText(text);
      } catch (error) {
        console.warn('⚠️ Роутер недоступен, использую fallback:', error.message);
        response = this.getDefaultResponse(text);
      }
      
      // Если роутер не дал ответ, используем fallback
      if (!response) {
        response = this.getDefaultResponse(text);
      }
      
      // Отправляем ответ пользователю
      await this.sendResponse(chatId, response);

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
   * @description Возвращает стандартный ответ если роутер недоступен
   * @param {string} text - Исходный текст пользователя
   * @returns {string} Стандартный ответ
   * @private
   */
  getDefaultResponse(text) {
    // Простые правила без роутера
    if (/(привет|здравствуй|hi|hello)/i.test(text)) {
      return 'Привет! 👋 Чем могу помочь?';
    }
    
    if (/(как дела|как ты|how are you)/i.test(text)) {
      return 'Спасибо, у меня все хорошо! 😊 А у вас как дела?';
    }
    
    if (/(спасибо|благодарю|thanks)/i.test(text)) {
      return 'Пожалуйста! Рад быть полезным! 🙏';
    }
    
    return 'Получил ваше сообщение! 📝 Спасибо за обращение.';
  }
}

module.exports = TextMessageHandler;
