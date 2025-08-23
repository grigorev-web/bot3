class Router {
  constructor() {
    this.name = 'Text Router Module';
  }

  // Простой метод для обработки текстовых сообщений
  processText(text) {
    return `📝 Вы написали: "${text}"`;
  }

  // Метод для получения информации о модуле
  getInfo() {
    return {
      name: this.name,
      description: 'Простой модуль для обработки текстовых сообщений',
      version: '1.0.0'
    };
  }
}

module.exports = Router;
