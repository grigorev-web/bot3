/**
 * @fileoverview Индексный файл для модуля приложения
 * @description Экспортирует основные классы приложения Telegram бота
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Экспортируем основной класс приложения
const TelegramBotApp = require('./app');

/**
 * @module app
 * @description Модуль приложения Telegram бота
 */
module.exports = {
  /**
   * @type {TelegramBotApp}
   * @description Основной класс приложения Telegram бота
   */
  TelegramBotApp
};
