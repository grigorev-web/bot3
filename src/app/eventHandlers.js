class EventHandlers {
  constructor(bot) {
    this.bot = bot;
    this.startTime = new Date();
  }

  handlePollingError(error) {
    console.error('❌ Ошибка поллинга:', error);
    console.error('⏰ Время ошибки:', new Date().toISOString());
  }

  handlePollingStart() {
    const uptime = process.uptime();
    console.log('🤖 Бот запущен и использует поллинг...');
    console.log('📱 Бот готов к работе!');
    console.log('⏰ Время запуска:', this.startTime.toLocaleString('ru-RU'));
    console.log('🔄 PID процесса:', process.pid);
    console.log('💾 Версия Node.js:', process.version);
  }

  handlePollingStop() {
    const uptime = process.uptime();
    console.log('🛑 Поллинг остановлен');
    console.log('⏱️ Время работы:', Math.floor(uptime / 60), 'мин', Math.floor(uptime % 60), 'сек');
  }

  handleWebhookError(error) {
    console.error('❌ Ошибка webhook:', error);
  }

  handleError(error) {
    console.error('❌ Общая ошибка бота:', error);
    console.error('📁 Файл:', error.fileName || 'неизвестно');
    console.error('📍 Строка:', error.lineNumber || 'неизвестно');
  }

  // Метод для graceful shutdown
  handleGracefulShutdown() {
    console.log('🔄 Выполняю graceful shutdown...');
    this.handlePollingStop();
  }
}

module.exports = EventHandlers;
