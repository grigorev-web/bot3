class TextMessageHandler {
  constructor(bot) {
    this.bot = bot;
  }

  handleTextMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    // Игнорируем команды
    if (text.startsWith('/')) {
      return false; // Сообщаем, что сообщение не обработано
    }
    
    // Обрабатываем обычные текстовые сообщения
    this.bot.sendMessage(chatId, `💬 Вы написали: "${text}"\n\nИспользуйте /help для получения списка команд.`);
    return true; // Сообщаем, что сообщение обработано
  }

  // Метод для проверки, является ли сообщение текстовым
  canHandle(msg) {
    return msg.text && !msg.text.startsWith('/');
  }
}

module.exports = TextMessageHandler;
