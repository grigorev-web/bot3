/**
 * @fileoverview Модель валидатора для проверки корректности Telegram сообщений
 * @author Bot3
 * @version 1.0.0
 * @group Validation
 */

/**
 * @class Validator
 * @description Класс для валидации различных типов данных
 */
class Validator {
  /**
   * @method validateTelegramMessage
   * @description Валидирует Telegram сообщение
   * @param {Object} msg - Объект сообщения Telegram
   * @returns {boolean} true если сообщение валидно, false в противном случае
   * @throws {Error} Ошибка валидации с описанием проблемы
   */
  validateTelegramMessage(msg) {
    if (!msg.text || typeof msg.text !== 'string') {
      throw new Error('Текст должен быть непустой строкой');
    }
    return true;
  }
}

module.exports = Validator;
