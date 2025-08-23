/**
 * @fileoverview Конфигурация для режима разработки
 * @description Настройки автоматической перезагрузки, логирования и hot reload
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 */

/**
 * @typedef {Object} AutoReloadConfig
 * @property {boolean} enabled - Включить автоматическую перезагрузку
 * @property {Array<string>} watchPaths - Пути для отслеживания изменений
 * @property {Array<string>} extensions - Расширения файлов для отслеживания
 * @property {Array<string>} ignorePatterns - Паттерны для игнорирования
 */

/**
 * @typedef {Object} LoggingConfig
 * @property {string} level - Уровень логирования
 * @property {boolean} showTimestamp - Показывать временные метки
 * @property {boolean} showFileInfo - Показывать информацию о файле
 */

/**
 * @typedef {Object} HotReloadConfig
 * @property {boolean} enabled - Включить hot reload
 * @property {number} checkInterval - Интервал проверки изменений в миллисекундах
 * @property {boolean} gracefulShutdown - Выполнять graceful shutdown
 */

/**
 * @typedef {Object} DevelopmentConfig
 * @property {AutoReloadConfig} autoReload - Настройки автоматической перезагрузки
 * @property {LoggingConfig} logging - Настройки логирования
 * @property {HotReloadConfig} hotReload - Настройки hot reload
 */

/**
 * @module development
 * @description Конфигурация для режима разработки
 */

/**
 * @type {DevelopmentConfig}
 * @description Конфигурация для режима разработки
 */
module.exports = {
  /**
   * @group Auto Reload Configuration
   * @description Настройки для автоматической перезагрузки
   */
  autoReload: {
    enabled: true,
    watchPaths: ['src/'],
    extensions: ['js', 'json'],
    ignorePatterns: [
      '**/*.test.js',
      '**/*.spec.js',
      '**/node_modules/**'
    ]
  },
  
  /**
   * @group Logging Configuration
   * @description Настройки логирования в режиме разработки
   */
  logging: {
    level: 'debug',
    showTimestamp: true,
    showFileInfo: true
  },
  
  /**
   * @group Hot Reload Configuration
   * @description Настройки для hot reload
   */
  hotReload: {
    enabled: true,
    checkInterval: 1000,
    gracefulShutdown: true
  }
};
