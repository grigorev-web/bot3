---
title: Правила разработки
description: Основные правила и принципы разработки проекта
category: contributing
tags: [разработка, правила, код, стиль, архитектура]
last_updated: 2024-01-01
author: Разработчик
version: 1.0.0
related_files: [.cursorrules, src/app/app.js, src/handlers/index.js]
---

# Правила разработки

## 🎯 Основные принципы

### 1. Читаемость кода
- Код должен быть понятным для других разработчиков
- Используйте описательные имена переменных и функций
- Добавляйте комментарии для сложной логики
- Следуйте принципу "код как документация"

### 2. Модульность
- Разделяйте код на логические модули
- Каждый модуль должен иметь одну ответственность
- Используйте интерфейсы для взаимодействия между модулями
- Избегайте циклических зависимостей

### 3. Тестируемость
- Пишите код, который легко тестировать
- Используйте dependency injection
- Разделяйте бизнес-логику и инфраструктуру
- Создавайте мокируемые зависимости

## 📁 Структура проекта

### Организация файлов
```
src/
├── app/           # Основное приложение
├── config/        # Конфигурация
├── handlers/      # Обработчики сообщений
├── modules/       # Модули и роутинг
├── utils/         # Утилиты и хелперы
├── services/      # Бизнес-логика
├── models/        # Модели данных
└── tests/         # Тесты
```

### Правила именования
- **Файлы**: camelCase для JavaScript, kebab-case для Markdown
- **Папки**: kebab-case
- **Классы**: PascalCase
- **Функции/переменные**: camelCase
- **Константы**: UPPER_SNAKE_CASE

## 🔧 Стиль кода

### JavaScript/Node.js
```javascript
// ✅ Хорошо
const userHandler = new UserHandler(config);
const result = await userHandler.processMessage(message);

// ❌ Плохо
const uh = new UH(cfg);
const r = await uh.pm(msg);
```

### Импорты и экспорты
```javascript
// ✅ Хорошо - группировка импортов
// Внешние зависимости
import express from 'express';
import { createServer } from 'http';

// Внутренние модули
import { config } from '../config';
import { logger } from '../utils/logger';

// ✅ Хорошо - именованные экспорты
export class MessageHandler {
  // ...
}

export const createHandler = (config) => {
  // ...
};

// ❌ Плохо - default экспорты для классов
export default class MessageHandler {
  // ...
}
```

### Функции
```javascript
// ✅ Хорошо - описательные имена
async function processUserMessage(message, userId) {
  // ...
}

// ✅ Хорошо - стрелочные функции для колбэков
const messageHandlers = {
  text: (msg) => processTextMessage(msg),
  image: (msg) => processImageMessage(msg)
};

// ❌ Плохо - неописательные имена
async function process(msg, id) {
  // ...
}
```

## 🏗️ Архитектурные принципы

### 1. Dependency Injection
```javascript
// ✅ Хорошо
class MessageProcessor {
  constructor(logger, database, config) {
    this.logger = logger;
    this.database = database;
    this.config = config;
  }
}

// ❌ Плохо
class MessageProcessor {
  constructor() {
    this.logger = require('../utils/logger');
    this.database = require('../database');
  }
}
```

### 2. Интерфейсы и абстракции
```javascript
// ✅ Хорошо - определяем интерфейс
/**
 * @interface MessageHandler
 */
class MessageHandler {
  /**
   * Обрабатывает сообщение
   * @param {Message} message
   * @returns {Promise<ProcessingResult>}
   */
  async handle(message) {
    throw new Error('Method not implemented');
  }
}

// ✅ Хорошо - реализуем интерфейс
class TextMessageHandler extends MessageHandler {
  async handle(message) {
    // Реализация
  }
}
```

### 3. Обработка ошибок
```javascript
// ✅ Хорошо - специфичные ошибки
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// ✅ Хорошо - правильная обработка
try {
  const result = await processMessage(message);
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    logger.warn(`Validation failed for field: ${error.field}`);
    throw new Error('Invalid message format');
  }
  throw error;
}
```

## 📝 JSDoc комментарии

### Обязательные комментарии
```javascript
/**
 * @fileoverview Обработчик текстовых сообщений
 * @module handlers/textMessageHandler
 * @author Ваше имя
 * @version 1.0.0
 */

/**
 * Обрабатывает входящее текстовое сообщение
 * @param {Object} message - Объект сообщения
 * @param {string} message.text - Текст сообщения
 * @param {string} message.userId - ID пользователя
 * @param {Date} message.timestamp - Временная метка
 * @returns {Promise<ProcessingResult>} Результат обработки
 * @throws {ValidationError} Если сообщение невалидно
 * @example
 * const result = await handleTextMessage({
 *   text: "Привет",
 *   userId: "123",
 *   timestamp: new Date()
 * });
 */
async function handleTextMessage(message) {
  // Реализация
}
```

### Для классов
```javascript
/**
 * @class TextMessageHandler
 * @description Обработчик текстовых сообщений
 * @implements MessageHandler
 * @since 1.0.0
 */
class TextMessageHandler {
  /**
   * Создает новый экземпляр обработчика
   * @param {Object} config - Конфигурация
   * @param {Logger} config.logger - Логгер
   * @param {Database} config.database - База данных
   */
  constructor(config) {
    this.logger = config.logger;
    this.database = config.database;
  }
}
```

## 🧪 Тестирование

### Структура тестов
```javascript
// ✅ Хорошо - структура теста
describe('TextMessageHandler', () => {
  let handler;
  let mockLogger;
  let mockDatabase;

  beforeEach(() => {
    mockLogger = createMockLogger();
    mockDatabase = createMockDatabase();
    handler = new TextMessageHandler({
      logger: mockLogger,
      database: mockDatabase
    });
  });

  describe('handle', () => {
    it('should process valid text message', async () => {
      // Arrange
      const message = createValidMessage();
      
      // Act
      const result = await handler.handle(message);
      
      // Assert
      expect(result.success).toBe(true);
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should throw error for invalid message', async () => {
      // Arrange
      const message = createInvalidMessage();
      
      // Act & Assert
      await expect(handler.handle(message))
        .rejects
        .toThrow(ValidationError);
    });
  });
});
```

### Моки и стабы
```javascript
// ✅ Хорошо - создание моков
function createMockLogger() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  };
}

// ✅ Хорошо - проверка вызовов
expect(mockLogger.info).toHaveBeenCalledWith(
  'Processing message',
  expect.objectContaining({ userId: '123' })
);
```

## 🔒 Безопасность

### 1. Валидация входных данных
```javascript
// ✅ Хорошо - валидация
function validateMessage(message) {
  if (!message.text || typeof message.text !== 'string') {
    throw new ValidationError('Text is required and must be string');
  }
  
  if (message.text.length > 1000) {
    throw new ValidationError('Text too long');
  }
  
  return true;
}
```

### 2. Санитизация данных
```javascript
// ✅ Хорошо - санитизация
import DOMPurify from 'dompurify';

function sanitizeText(text) {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}
```

### 3. Логирование безопасности
```javascript
// ✅ Хорошо - логирование подозрительной активности
if (message.text.includes('<script>')) {
  logger.warn('Potential XSS attempt', {
    userId: message.userId,
    text: message.text,
    timestamp: new Date()
  });
}
```

## 📊 Производительность

### 1. Асинхронность
```javascript
// ✅ Хорошо - параллельная обработка
async function processMultipleMessages(messages) {
  const promises = messages.map(msg => processMessage(msg));
  return Promise.all(promises);
}

// ❌ Плохо - последовательная обработка
async function processMultipleMessages(messages) {
  const results = [];
  for (const msg of messages) {
    const result = await processMessage(msg);
    results.push(result);
  }
  return results;
}
```

### 2. Кэширование
```javascript
// ✅ Хорошо - простое кэширование
class MessageCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 минут
  }

  get(key) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < this.ttl) {
      return item.value;
    }
    this.cache.delete(key);
    return null;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
}
```

## 🔄 Рефакторинг

### Когда рефакторить
- Код дублируется в нескольких местах
- Функция выполняет слишком много задач
- Имена переменных/функций неясны
- Сложность кода превышает понимание

### Как рефакторить
1. **Извлечение метода** - выносите повторяющийся код в отдельные функции
2. **Переименование** - делайте имена более описательными
3. **Разделение ответственности** - разбивайте большие функции на маленькие
4. **Упрощение условий** - упрощайте сложные условные выражения

## 📚 Дополнительные ресурсы

- [Стиль кода](code-style.md)
- [Архитектура проекта](../architecture/overview.md)
- [API документация](../api/overview.md)
- [Руководства](../guides/)

## ✅ Контрольный список

Перед коммитом проверьте:

- [ ] Код следует установленным правилам
- [ ] Добавлены JSDoc комментарии для новых функций
- [ ] Написаны тесты для новой функциональности
- [ ] Обновлена документация при необходимости
- [ ] Код прошел линтинг без ошибок
- [ ] Все тесты проходят успешно

---

*Следуйте этим правилам для создания качественного, читаемого и поддерживаемого кода.*
