/**
 * @fileoverview Обработчик медиа сообщений Telegram бота
 * @description Обрабатывает фото, документы, голосовые сообщения, видео, аудио и стикеры
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 * @requires node-telegram-bot-api
 */

/**
 * @typedef {Object} MediaMessage
 * @property {number} chat.id - ID чата
 * @property {Array} [photo] - Массив фото объектов
 * @property {Object} [document] - Объект документа
 * @property {Object} [voice] - Объект голосового сообщения
 * @property {Object} [video] - Объект видео
 * @property {Object} [audio] - Объект аудио
 * @property {Object} [sticker] - Объект стикера
 */

/**
 * @typedef {Object} MediaType
 * @property {string} type - Тип медиа
 * @property {string} emoji - Эмодзи для типа медиа
 * @property {string} description - Описание типа медиа
 */

/**
 * @class MediaMessageHandler
 * @description Класс для обработки различных типов медиа сообщений
 * @example
 * const mediaHandler = new MediaMessageHandler(bot);
 * if (mediaHandler.canHandle(message)) {
 *   mediaHandler.handleMediaMessage(message);
 * }
 */
class MediaMessageHandler {
  /**
   * @constructor
   * @param {Object} bot - Экземпляр Telegram бота
   * @throws {Error} Если экземпляр бота не передан
   */
  constructor(bot) {
    if (!bot) {
      throw new Error('Экземпляр бота обязателен для MediaMessageHandler');
    }
    
    this.bot = bot;
    this.mediaTypes = this.getMediaTypes();
    
    console.log('🔧 MediaMessageHandler инициализирован');
  }

  /**
   * @group Media Type Definitions
   * @description Возвращает определения поддерживаемых типов медиа
   * @returns {Array<MediaType>} Массив типов медиа
   * @private
   */
  getMediaTypes() {
    return [
      { type: 'photo', emoji: '📸', description: 'фото' },
      { type: 'document', emoji: '📄', description: 'документ' },
      { type: 'voice', emoji: '🎤', description: 'голосовое сообщение' },
      { type: 'video', emoji: '🎥', description: 'видео' },
      { type: 'audio', emoji: '🎵', description: 'аудио' },
      { type: 'sticker', emoji: '😄', description: 'стикер' }
    ];
  }

  /**
   * @group Message Processing
   * @description Обрабатывает медиа сообщение в зависимости от его типа
   * @param {MediaMessage} msg - Объект медиа сообщения
   * @returns {Promise<boolean>} true если сообщение обработано, false в противном случае
   */
  async handleMediaMessage(msg) {
    try {
      const chatId = msg.chat.id;
      const mediaType = this.detectMediaType(msg);
      
      if (!mediaType) {
        console.log('⚠️ Неизвестный тип медиа сообщения');
        return false;
      }
      
      console.log(`🖼️ Обрабатываю ${mediaType.description} от чата ${chatId}`);
      
      // Обрабатываем медиа в зависимости от типа
      const result = await this.processMediaByType(msg, chatId, mediaType);
      
      if (result) {
        console.log(`✅ ${mediaType.description} успешно обработан для чата ${chatId}`);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ Ошибка обработки медиа сообщения:', error);
      await this.sendErrorMessage(msg.chat.id);
      return false;
    }
  }

  /**
   * @group Media Detection
   * @description Определяет тип медиа в сообщении
   * @param {MediaMessage} msg - Объект сообщения
   * @returns {MediaType|null} Тип медиа или null если не определен
   * @private
   */
  detectMediaType(msg) {
    for (const mediaType of this.mediaTypes) {
      if (msg[mediaType.type]) {
        return mediaType;
      }
    }
    return null;
  }

  /**
   * @group Media Processing
   * @description Обрабатывает медиа в зависимости от его типа
   * @param {MediaMessage} msg - Объект сообщения
   * @param {number} chatId - ID чата
   * @param {MediaType} mediaType - Тип медиа
   * @returns {Promise<boolean>} true если обработка успешна
   * @private
   */
  async processMediaByType(msg, chatId, mediaType) {
    const handlers = {
      photo: () => this.handlePhoto(msg, chatId),
      document: () => this.handleDocument(msg, chatId),
      voice: () => this.handleVoice(msg, chatId),
      video: () => this.handleVideo(msg, chatId),
      audio: () => this.handleAudio(msg, chatId),
      sticker: () => this.handleSticker(msg, chatId)
    };
    
    const handler = handlers[mediaType.type];
    if (handler) {
      return await handler();
    }
    
    return false;
  }

  /**
   * @group Photo Handling
   * @description Обрабатывает фото сообщения
   * @param {MediaMessage} msg - Объект сообщения
   * @param {number} chatId - ID чата
   * @returns {Promise<boolean>} true если обработка успешна
   * @private
   */
  async handlePhoto(msg, chatId) {
    try {
      const photoCount = msg.photo.length;
      const response = `📸 Получил ваше фото${photoCount > 1 ? ` (${photoCount} изображений)` : ''}! ` +
                      `Спасибо за изображение.`;
      
      await this.bot.sendMessage(chatId, response);
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка обработки фото:', error);
      return false;
    }
  }

  /**
   * @group Document Handling
   * @description Обрабатывает документ сообщения
   * @param {MediaMessage} msg - Объект сообщения
   * @param {number} chatId - ID чата
   * @returns {Promise<boolean>} true если обработка успешна
   * @private
   */
  async handleDocument(msg, chatId) {
    try {
      const fileName = msg.document.file_name || 'документ';
      const fileSize = this.formatFileSize(msg.document.file_size);
      const mimeType = msg.document.mime_type || 'неизвестный тип';
      
      const response = `📄 Получил ваш документ "<b>${fileName}</b>"!\n\n` +
                      `📊 Размер: ${fileSize}\n` +
                      `🔧 Тип: ${mimeType}\n\n` +
                      `✅ Файл успешно загружен.`;
      
      await this.bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка обработки документа:', error);
      return false;
    }
  }

  /**
   * @group Voice Handling
   * @description Обрабатывает голосовое сообщение
   * @param {MediaMessage} msg - Объект сообщения
   * @param {number} chatId - ID чата
   * @returns {Promise<boolean>} true если обработка успешна
   * @private
   */
  async handleVoice(msg, chatId) {
    try {
      const duration = msg.voice.duration || 0;
      const durationText = this.formatDuration(duration);
      
      const response = `🎤 Получил ваше голосовое сообщение (${durationText})!\n\n` +
                      `🎵 Очень приятно вас слышать.`;
      
      await this.bot.sendMessage(chatId, response);
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка обработки голосового сообщения:', error);
      return false;
    }
  }

  /**
   * @group Video Handling
   * @description Обрабатывает видео сообщение
   * @param {MediaMessage} msg - Объект сообщения
   * @param {number} chatId - ID чата
   * @returns {Promise<boolean>} true если обработка успешна
   * @private
   */
  async handleVideo(msg, chatId) {
    try {
      const duration = msg.video.duration || 0;
      const durationText = this.formatDuration(duration);
      
      const response = `🎥 Получил ваше видео (${durationText})!\n\n` +
                      `🎬 Отличный ролик!`;
      
      await this.bot.sendMessage(chatId, response);
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка обработки видео:', error);
      return false;
    }
  }

  /**
   * @group Audio Handling
   * @description Обрабатывает аудио сообщение
   * @param {MediaMessage} msg - Объект сообщения
   * @param {number} chatId - ID чата
   * @returns {Promise<boolean>} true если обработка успешна
   * @private
   */
  async handleAudio(msg, chatId) {
    try {
      const title = msg.audio.title || 'аудио';
      const performer = msg.audio.performer || 'неизвестный исполнитель';
      const duration = msg.audio.duration || 0;
      const durationText = this.formatDuration(duration);
      
      const response = `🎵 Получил аудио "<b>${title}</b>" от ${performer}!\n\n` +
                      `⏱️ Длительность: ${durationText}\n\n` +
                      `🎶 Отличная музыка!`;
      
      await this.bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка обработки аудио:', error);
      return false;
    }
  }

  /**
   * @group Sticker Handling
   * @description Обрабатывает стикер сообщение
   * @param {MediaMessage} msg - Объект сообщения
   * @param {number} chatId - ID чата
   * @returns {Promise<boolean>} true если обработка успешна
   * @private
   */
  async handleSticker(msg, chatId) {
    try {
      const emoji = msg.sticker.emoji || '😄';
      const setName = msg.sticker.set_name || 'стандартный набор';
      
      const response = `${emoji} Получил ваш стикер из набора "${setName}"!\n\n` +
                      `🎭 Очень мило!`;
      
      await this.bot.sendMessage(chatId, response);
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка обработки стикера:', error);
      return false;
    }
  }

  /**
   * @group Utility Methods
   * @description Форматирует размер файла в читаемом виде
   * @param {number} bytes - Размер в байтах
   * @returns {string} Отформатированный размер
   * @private
   */
  formatFileSize(bytes) {
    if (!bytes) return 'неизвестно';
    
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * @group Utility Methods
   * @description Форматирует длительность в читаемом виде
   * @param {number} seconds - Длительность в секундах
   * @returns {string} Отформатированная длительность
   * @private
   */
  formatDuration(seconds) {
    if (!seconds) return 'неизвестно';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes} мин ${remainingSeconds} сек`;
    }
    
    return `${remainingSeconds} сек`;
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
      const errorMessage = '❌ Произошла ошибка при обработке медиа. Попробуйте позже.';
      await this.bot.sendMessage(chatId, errorMessage);
    } catch (sendError) {
      console.error('❌ Не удалось отправить сообщение об ошибке:', sendError);
    }
  }

  /**
   * @group Message Validation
   * @description Проверяет, может ли обработчик обработать данное сообщение
   * @param {Object} msg - Объект сообщения от Telegram
   * @returns {boolean} true если сообщение можно обработать, false в противном случае
   */
  canHandle(msg) {
    return this.detectMediaType(msg) !== null;
  }

  /**
   * @group Accessors
   * @description Возвращает список поддерживаемых типов медиа
   * @returns {Array<string>} Массив типов медиа
   */
  getSupportedMediaTypes() {
    return this.mediaTypes.map(type => type.type);
  }

  /**
   * @group Accessors
   * @description Возвращает статистику обработчика медиа
   * @returns {Object} Статистика обработчика
   */
  getStats() {
    return {
      handlerName: 'MediaMessageHandler',
      supportedTypes: this.getSupportedMediaTypes(),
      totalTypes: this.mediaTypes.length
    };
  }
}

module.exports = MediaMessageHandler;
