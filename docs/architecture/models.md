---
title: Конфигурация LLM моделей
description: Детальное описание доступных нейронок и их параметров
category: architecture
tags: [модели, llm, конфигурация, нейронки, провайдеры]
last_updated: 2024-01-01
author: Разработчик
version: 4.0.0
related_files: [src/config/models.js, src/services/llm/llmService.js]
---

# Конфигурация LLM моделей

## 🎯 Обзор

Файл `src/config/models.js` содержит полную мапу всех доступных LLM моделей с их параметрами, комментариями и удобным API для работы с ними.

## 🏗️ Структура

### Основные компоненты

```javascript
src/config/models/
├── index.js           # Экспорт всех настроек
├── models.js          # Мапа доступных LLM моделей
└── llm.js             # Конфигурация LLM сервиса
```

### Импорт и использование

```javascript
// Импорт всех настроек
const models = require('./src/config/models');

// Доступ к менеджеру моделей
const { modelManager } = models;

// Доступ к конфигурации LLM
const { llmConfig } = models;

// Удобные геттеры
const { getDefaultProvider, getProviderConfig } = models;
```

## 📋 Доступные модели

### OpenAI модели

#### GPT-4 Turbo
- **ID**: `gpt-4-turbo`
- **Провайдер**: OpenAI
- **Макс токены**: 128,000
- **Описание**: Самая мощная модель для сложных задач
- **Применение**: Анализ, творчество, сложные вычисления

#### GPT-4
- **ID**: `gpt-4`
- **Провайдер**: OpenAI
- **Макс токены**: 8,192
- **Описание**: Базовая GPT-4 с отличными возможностями
- **Применение**: Общие задачи, хороший баланс цена/качество

#### GPT-3.5 Turbo
- **ID**: `gpt-3.5-turbo`
- **Провайдер**: OpenAI
- **Макс токены**: 4,096
- **Описание**: Быстрая и экономичная модель
- **Применение**: Повседневные задачи, быстрые ответы

### Anthropic модели

#### Claude 3 Sonnet
- **ID**: `claude-3-sonnet`
- **Провайдер**: Anthropic
- **Макс токены**: 200,000
- **Описание**: Отличный баланс качества и скорости
- **Применение**: Анализ документов, длинные тексты

#### Claude 3 Haiku
- **ID**: `claude-3-haiku`
- **Провайдер**: Anthropic
- **Макс токены**: 200,000
- **Описание**: Самая быстрая модель Claude 3
- **Применение**: Быстрые вопросы, простые задачи

#### Claude 3 Opus
- **ID**: `claude-3-opus`
- **Провайдер**: Anthropic
- **Макс токены**: 200,000
- **Описание**: Самая мощная модель Claude 3
- **Применение**: Сложные аналитические и творческие задачи

### Google Gemini модели

#### Gemini Pro
- **ID**: `gemini-pro`
- **Провайдер**: Google
- **Макс токены**: 32,768
- **Описание**: Мощная модель для широкого спектра задач
- **Применение**: Общие задачи, интеграция с Google сервисами

#### Gemini Flash
- **ID**: `gemini-flash`
- **Провайдер**: Google
- **Макс токены**: 1,048,576
- **Описание**: Быстрая модель с очень длинными контекстами
- **Применение**: Длинные документы, быстрые ответы

### DeepSeek модели

#### DeepSeek Chat
- **ID**: `deepseek-chat`
- **Провайдер**: DeepSeek
- **Макс токены**: 32,768
- **Описание**: Мощная модель для чата и анализа
- **Применение**: Технические и аналитические задачи

#### DeepSeek Coder
- **ID**: `deepseek-coder`
- **Провайдер**: DeepSeek
- **Макс токены**: 16,384
- **Описание**: Специализированная модель для программирования
- **Применение**: Генерация и анализ кода

## 🔧 API ModelManager

### Основные методы

#### Получение моделей
```javascript
// Получить конкретную модель
const model = modelManager.getModel('gpt-4-turbo');

// Получить все модели
const allModels = modelManager.getAllModels();

// Получить только активные модели
const activeModels = modelManager.getActiveModels();
```

#### Фильтрация по параметрам
```javascript
// По провайдеру
const openaiModels = modelManager.getModelsByProvider('openai');

// По категории
const chatModels = modelManager.getModelsByCategory('chat');

// По языку
const multilingualModels = modelManager.getModelsByLanguage('multilingual');
```

#### Поиск и валидация
```javascript
// Поиск по названию/описанию
const searchResults = modelManager.searchModels('gpt');

// Проверка существования
const exists = modelManager.modelExists('gpt-4');

// Проверка активности
const isActive = modelManager.isModelActive('gpt-4');
```

#### Статистика
```javascript
const stats = modelManager.getModelStats();
// {
//   total: 10,
//   active: 10,
//   byProvider: { openai: 3, anthropic: 3, gemini: 2, deepseek: 2 },
//   byCategory: { chat: 9, code: 1 }
// }
```

## 📊 Структура модели

### ModelConfig интерфейс

```javascript
/**
 * @typedef {Object} ModelConfig
 * @property {string} id - Уникальный идентификатор
 * @property {string} name - Человекочитаемое название
 * @property {string} provider - Провайдер (openai, anthropic, gemini, deepseek)
 * @property {string} model - Название у провайдера
 * @property {string} description - Описание возможностей
 * @property {number} maxTokens - Максимальное количество токенов
 * @property {number} temperature - Температура генерации (0.0 - 2.0)
 * @property {string} category - Категория (chat, code, creative)
 * @property {string} language - Основной язык
 * @property {boolean} isActive - Активна ли модель
 * @property {string} notes - Дополнительные заметки
 */
```

## �� Использование

### Импорт конфигурации

```javascript
// Основной импорт
const models = require('./src/config/models');

// Или через основной индекс конфигурации
const { models } = require('./src/config');
```

### В роутере

```javascript
const { modelManager } = require('../config/models');

// Получить конфигурацию модели
const modelConfig = modelManager.getModel('gpt-4-turbo');

// Использовать параметры модели
const maxTokens = modelConfig.maxTokens;
const temperature = modelConfig.temperature;
```

### В LLM сервисе

```javascript
const { modelManager, llmConfig } = require('../config/models');

// Валидация модели
if (!modelManager.modelExists(modelId)) {
  throw new Error(`Модель ${modelId} не найдена`);
}

// Получение конфигурации модели
const config = modelManager.getModel(modelId);

// Получение настроек LLM
const providerConfig = llmConfig.providers[config.provider];
```

### В конфигурации

```javascript
const { AVAILABLE_MODELS, llmConfig } = require('./models');

// Проверка доступности модели
const isAvailable = 'gpt-4' in AVAILABLE_MODELS;

// Получение списка провайдеров
const providers = Object.keys(llmConfig.providers);

// Получение настроек по умолчанию
const defaultProvider = llmConfig.defaultProvider;
```

## 🔍 Группировки

### По провайдерам
- **OpenAI**: 3 модели (GPT-4 Turbo, GPT-4, GPT-3.5 Turbo)
- **Anthropic**: 3 модели (Claude 3 Sonnet, Haiku, Opus)
- **Google**: 2 модели (Gemini Pro, Flash)
- **DeepSeek**: 2 модели (Chat, Coder)

### По категориям
- **Chat**: 9 моделей (все кроме DeepSeek Coder)
- **Code**: 1 модель (DeepSeek Coder)

### По языкам
- **Multilingual**: 10 моделей (все модели)

## 📝 Добавление новых моделей

### 1. Добавить в AVAILABLE_MODELS
```javascript
'new-model-id': {
  id: 'new-model-id',
  name: 'New Model Name',
  provider: 'provider-name',
  model: 'actual-model-name',
  description: 'Описание модели',
  maxTokens: 10000,
  temperature: 0.7,
  category: 'chat',
  language: 'multilingual',
  isActive: true,
  notes: 'Дополнительные заметки'
}
```

### 2. Обновить группировки
```javascript
// В MODELS_BY_PROVIDER
'provider-name': [...existing, 'new-model-id'],

// В MODELS_BY_CATEGORY
'category-name': [...existing, 'new-model-id'],

// В MODELS_BY_LANGUAGE
'language-name': [...existing, 'new-model-id']
```

## 🔒 Безопасность

### Валидация
- Все модели проходят проверку существования
- Проверяется активность модели перед использованием
- Валидируются параметры модели

### Конфигурация
- Модели можно легко отключать через `isActive: false`
- Параметры модели настраиваются централизованно
- Легко добавлять новые провайдеры и модели

## 📈 Мониторинг

### Статистика использования
- Количество доступных моделей
- Группировка по провайдерам и категориям
- Активные/неактивные модели

### Логирование
- Все операции с моделями логируются
- Ошибки валидации отслеживаются
- Статистика использования собирается

---

*Для детальной информации о конкретных моделях см. `src/config/models.js`.*
