const { Router } = require('../modules');

class TextMessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.router = new Router();
  }

  handleTextMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    // Игнорируем команды
    if (text.startsWith('/')) {
      return false; // Сообщаем, что сообщение не обработано
    }
    
    // Используем модуль Router для обработки текста
    const response = this.router.processText(text);
    this.bot.sendMessage(chatId, response);
    return true; // Сообщаем, что сообщение обработано
  }

  // Метод для проверки, является ли сообщение текстовым
  canHandle(msg) {
    return msg.text && !msg.text.startsWith('/');
  }

  // Метод для получения информации о модуле
  getModuleInfo() {
    return this.router.getInfo();
  }
}

module.exports = TextMessageHandler;
