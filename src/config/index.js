/**
 * @fileoverview Основной индексный файл конфигурации
 * @description Экспортирует все настройки проекта
 * @author Telegram Bot Team
 * @version 4.0.0
 * @since 2024-01-01
 */

const development = require('./development');
const models = require('./models');

module.exports = {
  development,
  models,
  
  // Удобные геттеры
  getDevelopmentConfig: () => development,
  getModelsConfig: () => models
};
