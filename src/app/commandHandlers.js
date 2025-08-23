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
/echo [текст] - Повторить ваш текст
/info - Информация о чате
/time - Текущее время

💡 Просто отправьте мне любое сообщение, и я отвечу!
    `;
    
    this.bot.sendMessage(chatId, helpText);
  }

  handleEcho(msg, match) {
    const chatId = msg.chat.id;
    const echoText = match[1];
    
    this.bot.sendMessage(chatId, `🔊 Эхо: ${echoText}`);
  }

  handleInfo(msg) {
    const chatId = msg.chat.id;
    const chatInfo = `
📊 Информация о чате:

ID чата: ${msg.chat.id}
Тип чата: ${msg.chat.type}
Название: ${msg.chat.title || 'Личный чат'}
Пользователь: ${msg.from.first_name} ${msg.from.last_name || ''}
Username: @${msg.from.username || 'не указан'}
    `;
    
    this.bot.sendMessage(chatId, chatInfo);
  }

  handleTime(msg) {
    const chatId = msg.chat.id;
    const now = new Date();
    const timeString = now.toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    this.bot.sendMessage(chatId, `🕐 Текущее время: ${timeString}`);
  }
}

module.exports = CommandHandlers;
