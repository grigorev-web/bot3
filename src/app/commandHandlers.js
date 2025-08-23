class CommandHandlers {
  constructor(bot) {
    this.bot = bot;
  }

  handleStart(msg) {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;
    
    this.bot.sendMessage(chatId, `Привет, ${userName}! 👋\n\nЯ телеграм бот с поллингом. Используй команду /help для получения списка доступных команд.`);
  }

  handleHelp(msg) {
    const chatId = msg.chat.id;
    
    const helpText = `
🤖 Доступные команды:

/start - Начать работу с ботом
/help - Показать это сообщение

💡 Просто отправьте мне любое сообщение, и я отвечу!
    `;
    
    this.bot.sendMessage(chatId, helpText);
  }
}

module.exports = CommandHandlers;
