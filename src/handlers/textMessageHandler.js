/**
 * @fileoverview Обработчик текстовых сообщений Telegram бота
 * @description Обрабатывает текстовые сообщения пользователей через простой роутер
 * @author Telegram Bot Team
 * @version 3.0.0
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
    this.router = null; // Ленивая загрузка роутера
    
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
      
      // Обрабатываем текст через роутер (ленивая загрузка)
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
   * @description Обрабатывает текст через роутер (ленивая загрузка)
   * @param {string} text - Текст для обработки
   * @returns {Promise<string>} Ответ от роутера
   * @private
   */
  async processTextWithRouter(text) {
    try {
      // Ленивая загрузка роутера
      if (!this.router) {
        this.router = await this.createRouter();
      }
      
      if (this.router) {
        // Получаем ответ от роутера
        const response = await this.router.processText(text);
        if (response) {
          return response;
        }
      }
      
      // Fallback ответ если роутер недоступен
      return this.getDefaultResponse(text);
      
    } catch (error) {
      console.warn('⚠️ Роутер недоступен, использую fallback:', error.message);
      return this.getDefaultResponse(text);
    }
  }

  /**
   * @group Router Creation
   * @description Создает роутер при необходимости
   * @returns {Promise<Object|null>} Роутер или null если недоступен
   * @private
   */
  async createRouter() {
    try {
      console.log('🚀 Создаю роутер...');
      
      // Динамически импортируем роутер
      const { SimpleRouter } = require('../modules/router');
      
      // Создаем роутер
      const router = new SimpleRouter();
      
      console.log('✅ Роутер создан и готов к работе');
      return router;
      
    } catch (error) {
      console.warn('⚠️ Не удалось создать роутер:', error.message);
      return null;
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

  /**
   * @group Accessors
   * @description Возвращает информацию о модуле
   * @returns {Object} Информация о модуле
   */
  getModuleInfo() {
    return {
      name: 'Text Message Handler',
      version: '3.0.0',
      hasRouter: !!this.router,
      routerStatus: this.router ? 'ready' : 'not_loaded'
    };
  }

  /**
   * @group Accessors
   * @description Возвращает статистику обработки
   * @returns {Object} Статистика
   */
  getStats() {
    return {
      hasRouter: !!this.router,
      routerStatus: this.router ? 'ready' : 'not_loaded'
    };
  }
}

module.exports = TextMessageHandler;
