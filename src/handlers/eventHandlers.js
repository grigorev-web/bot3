/**
 * @fileoverview Обработчики системных событий Telegram бота
 * @description Обрабатывает события поллинга, ошибки и системные события
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 * @requires node-telegram-bot-api
 */

/**
 * @typedef {Object} BotStats
 * @property {Date} startTime - Время запуска бота
 * @property {number} uptime - Время работы в секундах
 * @property {number} messageCount - Количество обработанных сообщений
 * @property {number} errorCount - Количество ошибок
 */

/**
 * @class EventHandlers
 * @description Класс для обработки системных событий и мониторинга состояния бота
 * @example
 * const eventHandlers = new EventHandlers(bot);
 * eventHandlers.handlePollingStart();
 */
class EventHandlers {
  /**
   * @constructor
   * @param {Object} bot - Экземпляр Telegram бота
   * @throws {Error} Если экземпляр бота не передан
   */
  constructor(bot) {
    if (!bot) {
      throw new Error('Экземпляр бота обязателен для EventHandlers');
    }
    
    this.bot = bot;
    this.startTime = new Date();
    this.stats = this.initializeStats();
    
    console.log('🔧 EventHandlers инициализирован');
  }

  /**
   * @group Statistics Initialization
   * @description Инициализирует статистику бота
   * @returns {BotStats} Начальная статистика
   * @private
   */
  initializeStats() {
    return {
      startTime: this.startTime,
      uptime: 0,
      messageCount: 0,
      errorCount: 0,
      lastError: null,
      lastActivity: this.startTime
    };
  }

  /**
   * @group Polling Event Handling
   * @description Обрабатывает ошибки поллинга
   * @param {Error} error - Объект ошибки
   */
  handlePollingError(error) {
    try {
      this.stats.errorCount++;
      this.stats.lastError = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date()
      };
      
      console.error('❌ Ошибка поллинга:', error.message);
      console.error('📁 Стек вызовов:', error.stack);
      console.error('⏰ Время ошибки:', new Date().toISOString());
      
      // Логируем дополнительную информацию об ошибке
      this.logErrorDetails(error);
      
    } catch (logError) {
      console.error('❌ Ошибка логирования ошибки поллинга:', logError);
    }
  }

  /**
   * @group Polling Event Handling
   * @description Обрабатывает успешный запуск поллинга
   */
  handlePollingStart() {
    try {
      const uptime = this.calculateUptime();
      const uptimeFormatted = this.formatUptime(uptime);
      
      console.log('🤖 Бот запущен и использует поллинг...');
      console.log('📱 Бот готов к работе!');
      console.log('⏰ Время запуска:', this.startTime.toLocaleString('ru-RU'));
      console.log('⏱️ Время работы:', uptimeFormatted);
      console.log('🔄 PID процесса:', process.pid);
      console.log('💾 Версия Node.js:', process.version);
      console.log('🌍 Временная зона:', Intl.DateTimeFormat().resolvedOptions().timeZone);
      
      // Обновляем статистику
      this.stats.lastActivity = new Date();
      
    } catch (error) {
      console.error('❌ Ошибка обработки запуска поллинга:', error);
    }
  }

  /**
   * @group Polling Event Handling
   * @description Обрабатывает остановку поллинга
   */
  handlePollingStop() {
    try {
      const uptime = this.calculateUptime();
      const uptimeFormatted = this.formatUptime(uptime);
      
      console.log('🛑 Поллинг остановлен');
      console.log('⏱️ Время работы:', uptimeFormatted);
      console.log('📊 Статистика работы:');
      console.log(`   📨 Сообщений обработано: ${this.stats.messageCount}`);
      console.log(`   ❌ Ошибок: ${this.stats.errorCount}`);
      
      // Обновляем статистику
      this.stats.uptime = uptime;
      
    } catch (error) {
      console.error('❌ Ошибка обработки остановки поллинга:', error);
    }
  }

  /**
   * @group Webhook Event Handling
   * @description Обрабатывает ошибки webhook
   * @param {Error} error - Объект ошибки
   */
  handleWebhookError(error) {
    try {
      this.stats.errorCount++;
      this.stats.lastError = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date(),
        type: 'webhook'
      };
      
      console.error('❌ Ошибка webhook:', error.message);
      console.error('📁 Стек вызовов:', error.stack);
      console.error('⏰ Время ошибки:', new Date().toISOString());
      
    } catch (logError) {
      console.error('❌ Ошибка логирования ошибки webhook:', logError);
    }
  }

  /**
   * @group General Error Handling
   * @description Обрабатывает общие ошибки бота
   * @param {Error} error - Объект ошибки
   */
  handleError(error) {
    try {
      this.stats.errorCount++;
      this.stats.lastError = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date(),
        type: 'general'
      };
      
      console.error('❌ Общая ошибка бота:', error.message);
      console.error('📁 Файл:', error.fileName || 'неизвестно');
      console.error('📍 Строка:', error.lineNumber || 'неизвестно');
      console.error('📁 Стек вызовов:', error.stack);
      
    } catch (logError) {
      console.error('❌ Ошибка логирования общей ошибки:', logError);
    }
  }

  /**
   * @group Graceful Shutdown
   * @description Выполняет graceful shutdown бота
   */
  handleGracefulShutdown() {
    try {
      console.log('🔄 Выполняю graceful shutdown...');
      
      // Обновляем статистику перед выключением
      const uptime = this.calculateUptime();
      this.stats.uptime = uptime;
      
      // Логируем финальную статистику
      this.logFinalStats();
      
      // Выполняем остановку поллинга
      this.handlePollingStop();
      
      console.log('✅ Graceful shutdown завершен');
      
    } catch (error) {
      console.error('❌ Ошибка graceful shutdown:', error);
    }
  }

  /**
   * @group Message Tracking
   * @description Увеличивает счетчик обработанных сообщений
   */
  incrementMessageCount() {
    this.stats.messageCount++;
    this.stats.lastActivity = new Date();
  }

  /**
   * @group Utility Methods
   * @description Вычисляет время работы бота
   * @returns {number} Время работы в секундах
   * @private
   */
  calculateUptime() {
    return Math.floor((Date.now() - this.startTime.getTime()) / 1000);
  }

  /**
   * @group Utility Methods
   * @description Форматирует время работы в читаемом виде
   * @param {number} seconds - Время в секундах
   * @returns {string} Отформатированное время
   * @private
   */
  formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours} ч ${minutes} мин ${remainingSeconds} сек`;
    } else if (minutes > 0) {
      return `${minutes} мин ${remainingSeconds} сек`;
    } else {
      return `${remainingSeconds} сек`;
    }
  }

  /**
   * @group Error Logging
   * @description Логирует детали ошибки
   * @param {Error} error - Объект ошибки
   * @private
   */
  logErrorDetails(error) {
    try {
      // Логируем системную информацию
      const systemInfo = {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      };
      
      console.error('💻 Системная информация:', JSON.stringify(systemInfo, null, 2));
      
    } catch (infoError) {
      console.error('❌ Не удалось получить системную информацию:', infoError);
    }
  }

  /**
   * @group Statistics Logging
   * @description Логирует финальную статистику работы
   * @private
   */
  logFinalStats() {
    try {
      console.log('📊 Финальная статистика работы бота:');
      console.log(`   🚀 Время запуска: ${this.startTime.toLocaleString('ru-RU')}`);
      console.log(`   ⏱️ Общее время работы: ${this.formatUptime(this.stats.uptime)}`);
      console.log(`   📨 Сообщений обработано: ${this.stats.messageCount}`);
      console.log(`   ❌ Ошибок: ${this.stats.errorCount}`);
      
      if (this.stats.lastError) {
        console.log(`   🚨 Последняя ошибка: ${this.stats.lastError.message}`);
      }
      
    } catch (error) {
      console.error('❌ Ошибка логирования финальной статистики:', error);
    }
  }

  /**
   * @group Accessors
   * @description Возвращает текущую статистику бота
   * @returns {BotStats} Объект статистики
   */
  getStats() {
    return {
      ...this.stats,
      uptime: this.calculateUptime(),
      uptimeFormatted: this.formatUptime(this.calculateUptime())
    };
  }

  /**
   * @group Accessors
   * @description Возвращает время запуска бота
   * @returns {Date} Время запуска
   */
  getStartTime() {
    return this.startTime;
  }

  /**
   * @group Accessors
   * @description Возвращает время последней активности
   * @returns {Date} Время последней активности
   */
  getLastActivity() {
    return this.stats.lastActivity;
  }

  /**
   * @group Accessors
   * @description Возвращает количество ошибок
   * @returns {number} Количество ошибок
   */
  getErrorCount() {
    return this.stats.errorCount;
  }

  /**
   * @group Accessors
   * @description Возвращает информацию о последней ошибке
   * @returns {Object|null} Информация о последней ошибке
   */
  getLastError() {
    return this.stats.lastError;
  }
}

module.exports = EventHandlers;
