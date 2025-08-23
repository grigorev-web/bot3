class EventHandlers {
  constructor(bot) {
    this.bot = bot;
  }

  handlePollingError(error) {
    console.error('Ошибка поллинга:', error);
  }

  handlePollingStart() {
    console.log('🤖 Бот запущен и использует поллинг...');
    console.log('📱 Бот готов к работе!');
  }

  handlePollingStop() {
    console.log('🛑 Поллинг остановлен');
  }

  handleWebhookError(error) {
    console.error('Ошибка webhook:', error);
  }

  handleError(error) {
    console.error('Общая ошибка бота:', error);
  }
}

module.exports = EventHandlers;
