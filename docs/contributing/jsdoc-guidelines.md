---
title: Руководство по JSDoc
description: Правила и примеры использования JSDoc для документации кода
category: contributing
tags: [jsdoc, documentation, code, cursor-ide]
last_updated: 2024-01-01
author: Telegram Bot Team
version: 1.0.0
related_files: [src/**/*.js, .cursorrules]
---

# Руководство по JSDoc

## Обзор

JSDoc - это стандарт для документирования JavaScript кода. В нашем проекте мы используем JSDoc для создания подробной документации, которая помогает Cursor IDE лучше понимать структуру кода и предоставлять качественные подсказки.

## Основные теги

### @fileoverview
Описание назначения файла.

```javascript
/**
 * @fileoverview Основной класс приложения Telegram бота
 * @description Управляет жизненным циклом бота, обработчиками событий и сообщений
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 * @requires node-telegram-bot-api
 * @requires ../handlers
 */
```

### @class
Описание класса.

```javascript
/**
 * @class TelegramBotApp
 * @description Основной класс приложения для управления Telegram ботом
 * @example
 * const botApp = new TelegramBotApp('YOUR_BOT_TOKEN');
 * botApp.start();
 */
class TelegramBotApp {
  // ...
}
```

### @constructor
Описание конструктора.

```javascript
/**
 * @constructor
 * @param {string} token - Токен бота от BotFather
 * @param {BotConfig} [config] - Дополнительная конфигурация бота
 * @throws {Error} Если токен не передан или недействителен
 */
constructor(token, config = {}) {
  // ...
}
```

### @param
Описание параметра функции.

```javascript
/**
 * @param {string} text - Текст для обработки
 * @param {number} [priority=0] - Приоритет обработки
 * @returns {Promise<string>} Результат обработки
 */
async processText(text, priority = 0) {
  // ...
}
```

### @returns
Описание возвращаемого значения.

```javascript
/**
 * @returns {boolean} true если сообщение обработано, false в противном случае
 */
canHandle(msg) {
  // ...
}
```

### @typedef
Определение пользовательского типа.

```javascript
/**
 * @typedef {Object} BotConfig
 * @property {boolean} polling - Включить поллинг для получения обновлений
 * @property {number} [pollingTimeout] - Таймаут поллинга в секундах
 * @property {boolean} [webHook] - Использовать webhook вместо поллинга
 */
```

### @group
Группировка связанных методов.

```javascript
/**
 * @group Lifecycle Management
 * @description Запускает телеграм бота с обработкой ошибок
 */
function startBot() {
  // ...
}

/**
 * @group Lifecycle Management
 * @description Останавливает бота и освобождает ресурсы
 */
function stopBot() {
  // ...
}
```

### @private
Обозначение приватного метода.

```javascript
/**
 * @group Utility Methods
 * @description Экранирует HTML-символы в тексте
 * @param {string} text - Текст для экранирования
 * @returns {string} Экранированный текст
 * @private
 */
escapeHtml(text) {
  // ...
}
```

### @example
Пример использования.

```javascript
/**
 * @example
 * const router = new Router();
 * router.addRule(/привет/i, (text) => 'Привет!', 'Приветствие', 1);
 * const response = await router.processText('Привет, как дела?');
 */
```

### @throws
Описание исключений.

```javascript
/**
 * @throws {Error} Если экземпляр бота не передан
 */
constructor(bot) {
  if (!bot) {
    throw new Error('Экземпляр бота обязателен для CommandHandlers');
  }
  // ...
}
```

### @requires
Зависимости модуля.

```javascript
/**
 * @requires node-telegram-bot-api
 * @requires ../handlers
 */
```

## Структура JSDoc комментария

### Полный пример для класса

```javascript
/**
 * @fileoverview Обработчик текстовых сообщений Telegram бота
 * @description Обрабатывает текстовые сообщения пользователей, исключая команды
 * @author Telegram Bot Team
 * @version 1.0.0
 * @since 2024-01-01
 * @requires ../modules
 */

const { Router } = require('../modules');

/**
 * @typedef {Object} TextMessage
 * @property {number} chat.id - ID чата
 * @property {string} text - Текст сообщения
 * @property {Object} from - Информация об отправителе
 */

/**
 * @class TextMessageHandler
 * @description Класс для обработки текстовых сообщений пользователей
 * @example
 * const textHandler = new TextMessageHandler(bot);
 * if (textHandler.canHandle(message)) {
 *   textHandler.handleTextMessage(message);
 * }
 */
class TextMessageHandler {
  /**
   * @constructor
   * @param {Object} bot - Экземпляр Telegram бота
   * @throws {Error} Если экземпляр бота не передан
   */
  constructor(bot) {
    // ...
  }

  /**
   * @group Message Processing
   * @description Обрабатывает текстовое сообщение пользователя
   * @param {TextMessage} msg - Объект текстового сообщения
   * @returns {Promise<boolean>} true если сообщение обработано, false в противном случае
   */
  async handleTextMessage(msg) {
    // ...
  }

  /**
   * @group Message Validation
   * @description Проверяет, может ли обработчик обработать данное сообщение
   * @param {Object} msg - Объект сообщения от Telegram
   * @returns {boolean} true если сообщение можно обработать, false в противном случае
   */
  canHandle(msg) {
    // ...
  }
}

module.exports = TextMessageHandler;
```

## Правила оформления

### 1. Обязательные теги для файлов
- `@fileoverview` - описание назначения файла
- `@description` - краткое описание
- `@author` - автор
- `@version` - версия
- `@since` - дата создания

### 2. Обязательные теги для классов
- `@class` - название класса
- `@description` - описание класса
- `@example` - пример использования

### 3. Обязательные теги для методов
- `@description` - описание метода
- `@param` - для всех параметров
- `@returns` - для возвращаемых значений
- `@group` - для группировки методов

### 4. Обязательные теги для конструкторов
- `@constructor`
- `@param` - для всех параметров
- `@throws` - если выбрасывает исключения

### 5. Группировка методов
Используйте `@group` для логической группировки методов:

```javascript
/**
 * @group Lifecycle Management
 * @description Управление жизненным циклом приложения
 */

/**
 * @group Event Handling
 * @description Обработка событий
 */

/**
 * @group Utility Methods
 * @description Вспомогательные методы
 */

/**
 * @group Accessors
 * @description Геттеры и сеттеры
 */
```

## Типизация

### Базовые типы
```javascript
/**
 * @param {string} text - Текст сообщения
 * @param {number} count - Количество элементов
 * @param {boolean} enabled - Включен ли режим
 * @param {Object} config - Конфигурация
 * @param {Array<string>} items - Массив строк
 * @param {Function} callback - Функция обратного вызова
 * @param {*} data - Любой тип данных
 */
```

### Пользовательские типы
```javascript
/**
 * @typedef {Object} UserConfig
 * @property {string} name - Имя пользователя
 * @property {number} age - Возраст пользователя
 * @property {Array<string>} roles - Роли пользователя
 */

/**
 * @param {UserConfig} userConfig - Конфигурация пользователя
 */
function processUser(userConfig) {
  // ...
}
```

### Union типы
```javascript
/**
 * @param {string|RegExp} pattern - Паттерн для сопоставления
 * @returns {string|number} Результат обработки
 */
function processPattern(pattern) {
  // ...
}
```

### Optional параметры
```javascript
/**
 * @param {string} required - Обязательный параметр
 * @param {number} [optional] - Необязательный параметр
 * @param {Object} [config={}] - Необязательный параметр с значением по умолчанию
 */
function example(required, optional, config = {}) {
  // ...
}
```

## Примеры для разных случаев

### Асинхронные методы
```javascript
/**
 * @group Message Processing
 * @description Асинхронно обрабатывает сообщение
 * @param {Object} msg - Сообщение для обработки
 * @returns {Promise<boolean>} Результат обработки
 * @throws {Error} При ошибке обработки
 */
async processMessage(msg) {
  try {
    // ...
    return true;
  } catch (error) {
    throw new Error(`Ошибка обработки: ${error.message}`);
  }
}
```

### Статические методы
```javascript
/**
 * @static
 * @group Utility Methods
 * @description Создает экземпляр класса
 * @param {Object} config - Конфигурация
 * @returns {MyClass} Экземпляр класса
 */
static create(config) {
  return new MyClass(config);
}
```

### Геттеры и сеттеры
```javascript
/**
 * @group Accessors
 * @description Получает имя пользователя
 * @returns {string} Имя пользователя
 */
get userName() {
  return this._userName;
}

/**
 * @group Accessors
 * @description Устанавливает имя пользователя
 * @param {string} name - Новое имя
 */
set userName(name) {
  this._userName = name;
}
```

### Callback функции
```javascript
/**
 * @callback MessageHandler
 * @param {Object} message - Сообщение для обработки
 * @param {Object} context - Контекст обработки
 * @returns {Promise<string>} Ответ на сообщение
 */

/**
 * @param {MessageHandler} handler - Функция обработки сообщений
 */
function setMessageHandler(handler) {
  // ...
}
```

## Лучшие практики

### 1. Консистентность
- Используйте одинаковый стиль во всем проекте
- Следуйте установленным шаблонам
- Поддерживайте единообразие в описаниях

### 2. Подробность
- Описывайте все параметры и возвращаемые значения
- Объясняйте сложную логику
- Добавляйте примеры для сложных случаев

### 3. Актуальность
- Обновляйте документацию при изменении кода
- Проверяйте соответствие документации и реализации
- Удаляйте устаревшую информацию

### 4. Читаемость
- Используйте понятный язык
- Структурируйте комментарии
- Добавляйте эмодзи для визуального разделения

### 5. Группировка
- Группируйте связанные методы
- Используйте логические категории
- Создавайте иерархию групп

## Проверка качества

### Автоматические проверки
```bash
# Проверка синтаксиса JSDoc
npx jsdoc --check src/

# Генерация документации
npx jsdoc src/ -d docs/jsdoc
```

### Ручные проверки
1. **Полнота**: Все публичные методы документированы
2. **Точность**: Описания соответствуют реализации
3. **Читаемость**: Документация понятна и структурирована
4. **Примеры**: Сложные случаи имеют примеры использования

## Заключение

Следование этим правилам JSDoc обеспечивает:
- Лучшую работу Cursor IDE
- Понимание кода другими разработчиками
- Автоматическую генерацию документации
- Качественные подсказки и автодополнение
- Профессиональный вид кода

Помните: хорошая документация - это инвестиция в будущее проекта!
