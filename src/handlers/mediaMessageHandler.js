class MediaMessageHandler {
  constructor(bot) {
    this.bot = bot;
  }

  handleMediaMessage(msg) {
    const chatId = msg.chat.id;
    
    if (msg.photo) {
      return this.handlePhoto(msg, chatId);
    } else if (msg.document) {
      return this.handleDocument(msg, chatId);
    } else if (msg.voice) {
      return this.handleVoice(msg, chatId);
    } else if (msg.video) {
      return this.handleVideo(msg, chatId);
    } else if (msg.audio) {
      return this.handleAudio(msg, chatId);
    } else if (msg.sticker) {
      return this.handleSticker(msg, chatId);
    }
    
    return false; // Сообщение не обработано
  }

  handlePhoto(msg, chatId) {
    this.bot.sendMessage(chatId, '📸 Получил ваше фото! Спасибо за изображение.');
    return true;
  }

  handleDocument(msg, chatId) {
    const fileName = msg.document.file_name || 'документ';
    this.bot.sendMessage(chatId, `📄 Получил ваш документ "${fileName}"! Файл успешно загружен.`);
    return true;
  }

  handleVoice(msg, chatId) {
    const duration = msg.voice.duration || 0;
    this.bot.sendMessage(chatId, `🎤 Получил ваше голосовое сообщение (${duration} сек)! Очень приятно вас слышать.`);
    return true;
  }

  handleVideo(msg, chatId) {
    this.bot.sendMessage(chatId, '🎥 Получил ваше видео! Отличный ролик!');
    return true;
  }

  handleAudio(msg, chatId) {
    const title = msg.audio.title || 'аудио';
    const performer = msg.audio.performer || 'неизвестный исполнитель';
    this.bot.sendMessage(chatId, `🎵 Получил аудио "${title}" от ${performer}! Отличная музыка!`);
    return true;
  }

  handleSticker(msg, chatId) {
    this.bot.sendMessage(chatId, '😄 Получил ваш стикер! Очень мило!');
    return true;
  }

  // Метод для проверки, является ли сообщение медиа
  canHandle(msg) {
    return msg.photo || msg.document || msg.voice || msg.video || msg.audio || msg.sticker;
  }
}

module.exports = MediaMessageHandler;
