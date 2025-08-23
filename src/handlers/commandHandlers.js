/**
 * @fileoverview Обработчики команд Telegram бота
 * @description Обрабатывает команды /start, /help и другие системные команды
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 * @requires node-telegram-bot-api
 */

/**
 * @typedef {Object} TelegramMessage
 * @property {number} chat.id - ID чата
 * @property {Object} from - Информация об отправителе
 * @property {string} from.first_name - Имя отправителя
 * @property {string} from.last_name - Фамилия отправителя
 * @property {string} from.username - Username отправителя
 */

/**
 * @class CommandHandlers
 * @description Класс для обработки команд Telegram бота
 * @example
 * const commandHandlers = new CommandHandlers(bot);
 * commandHandlers.handleStart(message);
 */
class CommandHandlers {
  /**
   * @constructor
   * @param {Object} bot - Экземпляр Telegram бота
   */
  constructor(bot) {
    if (!bot) {
      throw new Error('Экземпляр бота обязателен для CommandHandlers');
    }
    
    this.bot = bot;
    this.commands = this.getAvailableCommands();
    
    console.log('🔧 CommandHandlers инициализирован');
  }

  /**
   * @group Command Information
   * @description Возвращает список доступных команд
   * @returns {Array<Object>} Массив команд с описанием
   * @private
   */
  getAvailableCommands() {
    return [
      {
        command: '/start',
        description: 'Начать работу с ботом',
        handler: 'handleStart'
      },
      {
        command: '/help',
        description: 'Показать справку по командам',
        handler: 'handleHelp'
      }
    ];
  }

  /**
   * @group Command Processing
   * @description Обрабатывает команду /start
   * @param {TelegramMessage} msg - Объект сообщения от Telegram
   * @returns {Promise<void>}
   */
  async handleStart(msg) {
    try {
      const chatId = msg.chat.id;
      const userName = this.extractUserName(msg);
      
      const welcomeMessage = this.buildWelcomeMessage(userName);
      
      await this.bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
      
      console.log(`✅ Команда /start обработана для чата ${chatId}`);
      
    } catch (error) {
      console.error('❌ Ошибка обработки команды /start:', error);
      await this.sendErrorMessage(msg.chat.id);
    }
  }

  /**
   * @group Command Processing
   * @description Обрабатывает команду /help
   * @param {TelegramMessage} msg - Объект сообщения от Telegram
   * @returns {Promise<void>}
   */
  async handleHelp(msg) {
    try {
      const chatId = msg.chat.id;
      
      const helpText = this.buildHelpMessage();
      
      await this.bot.sendMessage(chatId, helpText, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
      
      console.log(`✅ Команда /help обработана для чата ${chatId}`);
      
    } catch (error) {
      console.error('❌ Ошибка обработки команды /help:', error);
      await this.sendErrorMessage(msg.chat.id);
    }
  }

  /**
   * @group Message Building
   * @description Строит приветственное сообщение
   * @param {string} userName - Имя пользователя
   * @returns {string} Отформатированное приветственное сообщение
   * @private
   */
  buildWelcomeMessage(userName) {
    return `Привет, <b>${userName}</b>! 👋\n\n` +
           `Я телеграм бот с поллингом. ` +
           `Используй команду <code>/help</code> для получения списка доступных команд.\n\n` +
           `🚀 Готов к работе!`;
  }

  /**
   * @group Message Building
   * @description Строит сообщение справки
   * @returns {string} Отформатированное сообщение справки
   * @private
   */
  buildHelpMessage() {
    let helpText = '🤖 <b>Доступные команды:</b>\n\n';
    
    this.commands.forEach(cmd => {
      helpText += `<code>${cmd.command}</code> - ${cmd.description}\n`;
    });
    
    helpText += '\n💡 <i>Просто отправьте мне любое сообщение, и я отвечу!</i>';
    
    return helpText;
  }

  /**
   * @group Utility Methods
   * @description Извлекает имя пользователя из сообщения
   * @param {TelegramMessage} msg - Объект сообщения
   * @returns {string} Имя пользователя или "Пользователь"
   * @private
   */
  extractUserName(msg) {
    if (msg.from) {
      if (msg.from.first_name) {
        return msg.from.first_name;
      } else if (msg.from.username) {
        return '@' + msg.from.username;
      }
    }
    return 'Пользователь';
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
      const errorMessage = '❌ Произошла ошибка при обработке команды. Попробуйте позже.';
      await this.bot.sendMessage(chatId, errorMessage);
    } catch (sendError) {
      console.error('❌ Не удалось отправить сообщение об ошибке:', sendError);
    }
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о доступных командах
   * @returns {Array<Object>} Массив команд
   */
  getCommands() {
    return this.commands;
  }

  /**
   * @group Accessors
   * @description Возвращает количество доступных команд
   * @returns {number} Количество команд
   */
  getCommandCount() {
    return this.commands.length;
  }
}

module.exports = CommandHandlers;
