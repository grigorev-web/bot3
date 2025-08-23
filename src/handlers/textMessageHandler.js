/**
 * @fileoverview Обработчик текстовых сообщений Telegram бота
 * @description Обрабатывает текстовые сообщения пользователей, исключая команды
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 * @requires ../modules
 */

const { Router } = require('../modules');

/**
 * @typedef {Object} TextMessage
 * @property {number} chat.id - ID чата
 * @property {string} text - Текст сообщения
 * @property {Object} from - Информация об отправителе
 */

/**
 * @class TextMessageHandler
 * @description Класс для обработки текстовых сообщений пользователей
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
    this.router = new Router();
    
    console.log('🔧 TextMessageHandler инициализирован');
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
      
      // Обрабатываем текст через модуль Router
      const response = await this.processTextWithRouter(text);
      
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
   * @group Text Processing
   * @description Обрабатывает текст через модуль Router
   * @param {string} text - Текст для обработки
   * @returns {Promise<string>} Ответ от роутера
   * @private
   */
  async processTextWithRouter(text) {
    try {
      // Используем модуль Router для обработки текста
      const response = await this.router.processText(text);
      
      if (!response) {
        throw new Error('Роутер не вернул ответ');
      }
      
      return response;
      
    } catch (error) {
      console.error('❌ Ошибка обработки текста через роутер:', error);
      return this.getDefaultResponse(text);
    }
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
           `💡 Это стандартный ответ. Модуль роутинга временно недоступен.`;
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
      return this.router.getInfo();
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
    return {
      handlerName: 'TextMessageHandler',
      routerModule: this.router.name || 'Router',
      canHandleCommands: false,
      supportsHtml: true
    };
  }
}

module.exports = TextMessageHandler;
