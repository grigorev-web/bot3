/**
 * @fileoverview Обработчик текстовых сообщений Telegram бота
 * @description Обрабатывает текстовые сообщения пользователей с простой логикой
 * @author Telegram Bot Team
 * @version 2.0.0
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
 * @description Простой класс для обработки текстовых сообщений
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
    this.llmService = null; // Ленивая загрузка LLM
    
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
      
      // Обрабатываем текст через LLM (ленивая загрузка)
      const response = await this.processTextWithLLM(text);
      
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
   * @description Обрабатывает текст через LLM (ленивая загрузка)
   * @param {string} text - Текст для обработки
   * @returns {Promise<string>} Ответ от LLM или fallback
   * @private
   */
  async processTextWithLLM(text) {
    try {
      // Ленивая загрузка LLM сервиса
      if (!this.llmService) {
        this.llmService = await this.createLLMService();
      }
      
      if (this.llmService) {
        // Пытаемся получить ответ от LLM
        const response = await this.llmService.generateResponse(text);
        if (response && response.content) {
          return response.content;
        }
      }
      
      // Fallback ответ если LLM недоступен
      return this.getDefaultResponse(text);
      
    } catch (error) {
      console.warn('⚠️ LLM недоступен, использую fallback:', error.message);
      return this.getDefaultResponse(text);
    }
  }

  /**
   * @group LLM Service Creation
   * @description Создает LLM сервис при необходимости
   * @returns {Promise<Object|null>} LLM сервис или null если недоступен
   * @private
   */
  async createLLMService() {
    try {
      console.log('🚀 Создаю LLM сервис...');
      
      // Динамически импортируем LLM сервис
      const { LLMService } = require('../services');
      
      // Создаем сервис (он сам разберется с конфигурацией)
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
   * @description Возвращает стандартный ответ если LLM недоступен
   * @param {string} text - Исходный текст пользователя
   * @returns {string} Стандартный ответ
   * @private
   */
  getDefaultResponse(text) {
    // Простые правила без LLM
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
      version: '2.0.0',
      hasLLM: !!this.llmService,
      llmStatus: this.llmService ? 'ready' : 'not_loaded'
    };
  }

  /**
   * @group Accessors
   * @description Возвращает статистику обработки
   * @returns {Object} Статистика
   */
  getStats() {
    return {
      hasLLM: !!this.llmService,
      llmStatus: this.llmService ? 'ready' : 'not_loaded'
    };
  }
}

module.exports = TextMessageHandler;
