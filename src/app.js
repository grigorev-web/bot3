const TelegramBot = require('node-telegram-bot-api');

class TelegramBotApp {
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true });
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Обработчик команды /start
    this.bot.onText(/\/start/, (msg) => {
      this.handleStart(msg);
    });

    // Обработчик команды /help
    this.bot.onText(/\/help/, (msg) => {
      this.handleHelp(msg);
    });

    // Обработчик команды /echo
    this.bot.onText(/\/echo (.+)/, (msg, match) => {
      this.handleEcho(msg, match);
    });

    // Обработчик команды /info
    this.bot.onText(/\/info/, (msg) => {
      this.handleInfo(msg);
    });

    // Обработчик команды /time
    this.bot.onText(/\/time/, (msg) => {
      this.handleTime(msg);
    });

    // Обработчик всех остальных сообщений
    this.bot.on('message', (msg) => {
      this.handleMessage(msg);
    });

    // Обработчик ошибок
    this.bot.on('polling_error', (error) => {
      this.handlePollingError(error);
    });

    // Обработчик успешного запуска
    this.bot.on('polling_start', () => {
      this.handlePollingStart();
    });
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

  handleMessage(msg) {
    const chatId = msg.chat.id;
    
    // Игнорируем команды
    if (msg.text && msg.text.startsWith('/')) {
      return;
    }
    
    // Отвечаем на обычные сообщения
    if (msg.text) {
      this.bot.sendMessage(chatId, `💬 Вы написали: "${msg.text}"\n\nИспользуйте /help для получения списка команд.`);
    } else if (msg.photo) {
      this.bot.sendMessage(chatId, '📸 Получил ваше фото! Спасибо за изображение.');
    } else if (msg.document) {
      this.bot.sendMessage(chatId, '📄 Получил ваш документ! Файл успешно загружен.');
    } else if (msg.voice) {
      this.bot.sendMessage(chatId, '🎤 Получил ваше голосовое сообщение! Очень приятно вас слышать.');
    } else {
      this.bot.sendMessage(chatId, '✅ Получил ваше сообщение! Спасибо за обращение.');
    }
  }

  handlePollingError(error) {
    console.error('Ошибка поллинга:', error);
  }

  handlePollingStart() {
    console.log('🤖 Бот запущен и использует поллинг...');
    console.log('📱 Бот готов к работе!');
  }

  stop() {
    console.log('🛑 Останавливаю бота...');
    this.bot.stopPolling();
  }

  getBot() {
    return this.bot;
  }
}

module.exports = TelegramBotApp;
