---
title: LLM Модели и ModelManager
description: Документация по конфигурации LLM моделей и управлению ими
category: architecture
tags: [llm, models, configuration, cost, rubles]
last_updated: 2024-12-19
author: Bot3 Development Team
version: 2.0.0
related_files: [src/config/models.js, src/config/index.js]
---

# 🤖 LLM Модели и ModelManager

## 📋 Обзор

Модуль `src/config` предоставляет централизованную конфигурацию всех доступных LLM моделей с актуальными ценами в рублях, а также удобный API для работы с ними через класс `ModelManager`.

## 🏗️ Структура

```
src/config/
├── models.js          # Конфигурация моделей и ModelManager
├── llm.js            # Настройки LLM сервиса
└── index.js          # Экспорт модуля
```

## 💰 Доступные модели

### OpenAI модели

#### GPT-4o
- **ID**: `gpt-4o`
- **Провайдер**: OpenAI
- **Макс токены**: 128,000
- **Описание**: Самая мощная модель для сложных задач
- **Применение**: Лучшая модель для сложных аналитических задач
- **Стоимость**: ₽612 входные, ₽2,448 выходные за 1K токенов

#### GPT-4o Mini
- **ID**: `gpt-4o-mini`
- **Провайдер**: OpenAI
- **Макс токены**: 128,000
- **Описание**: Быстрая и экономичная версия GPT-4o
- **Применение**: Отличный баланс цена/качество
- **Стоимость**: ₽36.72 входные, ₽146.88 выходные за 1K токенов

#### GPT-4 Turbo
- **ID**: `gpt-4-turbo`
- **Провайдер**: OpenAI
- **Макс токены**: 128,000
- **Описание**: Мощная модель для сложных задач
- **Применение**: Для сложных аналитических и творческих задач
- **Стоимость**: ₽2,448 входные, ₽7,344 выходные за 1K токенов

#### GPT-4
- **ID**: `gpt-4`
- **Провайдер**: OpenAI
- **Макс токены**: 8,192
- **Описание**: Базовая GPT-4 с отличными возможностями
- **Применение**: Хороший баланс цена/качество
- **Стоимость**: ₽2,448 входные, ₽7,344 выходные за 1K токенов

#### GPT-3.5 Turbo
- **ID**: `gpt-3.5-turbo`
- **Провайдер**: OpenAI
- **Макс токены**: 4,096
- **Описание**: Быстрая и экономичная модель
- **Применение**: Для повседневных задач и быстрых ответов
- **Стоимость**: ₽122.40 входные, ₽367.20 выходные за 1K токенов

#### GPT-5
- **ID**: `gpt-5`
- **Провайдер**: OpenAI
- **Макс токены**: 128,000
- **Описание**: Новейшая модель OpenAI
- **Применение**: Самая новая и мощная модель
- **Стоимость**: ₽306 входные, ₽2,448 выходные за 1K токенов

### Anthropic модели

#### Claude 3 Opus
- **ID**: `claude-3-opus`
- **Провайдер**: Anthropic
- **Макс токены**: 200,000
- **Описание**: Самая мощная модель Claude 3
- **Применение**: Для сложных аналитических и творческих задач
- **Стоимость**: ₽3,672 входные, ₽18,360 выходные за 1K токенов

#### Claude 3 Sonnet
- **ID**: `claude-3-sonnet`
- **Провайдер**: Anthropic
- **Макс токены**: 200,000
- **Описание**: Отличный баланс качества и скорости
- **Применение**: Для анализа документов и длинных текстов
- **Стоимость**: ₽734.40 входные, ₽3,672 выходные за 1K токенов

#### Claude 3 Haiku
- **ID**: `claude-3-haiku`
- **Провайдер**: Anthropic
- **Макс токены**: 200,000
- **Описание**: Самая быстрая модель Claude 3
- **Применение**: Для быстрых вопросов и простых задач
- **Стоимость**: ₽244.80 входные, ₽1,224 выходные за 1K токенов

### Google Gemini модели

#### Gemini 2.5 Pro
- **ID**: `gemini-2.5-pro`
- **Провайдер**: Google
- **Макс токены**: 1,000,000
- **Описание**: Мощная модель для широкого спектра задач
- **Применение**: Интеграция с Google сервисами
- **Стоимость**: ₽306 входные, ₽2,448 выходные за 1K токенов

#### Gemini 2.5 Flash
- **ID**: `gemini-2.5-flash`
- **Провайдер**: Google
- **Макс токены**: 1,000,000
- **Описание**: Быстрая модель с очень длинными контекстами
- **Применение**: Для длинных документов и быстрых ответов
- **Стоимость**: ₽73.44 входные, ₽612 выходные за 1K токенов

#### Gemini 1.5 Pro
- **ID**: `gemini-1.5-pro`
- **Провайдер**: Google
- **Макс токены**: 1,000,000
- **Описание**: Мощная модель с длинным контекстом
- **Применение**: Отличная для работы с длинными документами
- **Стоимость**: ₽856.80 входные, ₽1,713.60 выходные за 1K токенов

#### Gemini 1.5 Flash
- **ID**: `gemini-1.5-flash`
- **Провайдер**: Google
- **Макс токены**: 1,000,000
- **Описание**: Быстрая и экономичная модель
- **Применение**: Быстрые ответы по доступной цене
- **Стоимость**: ₽18.36 входные, ₽73.44 выходные за 1K токенов

### DeepSeek модели

#### DeepSeek Chat
- **ID**: `deepseek-chat`
- **Провайдер**: DeepSeek
- **Макс токены**: 32,768
- **Описание**: Мощная модель для чата и анализа
- **Применение**: Отличная для технических и аналитических задач
- **Стоимость**: ₽66.10 входные, ₽269.28 выходные за 1K токенов

#### DeepSeek Coder
- **ID**: `deepseek-coder`
- **Провайдер**: DeepSeek
- **Макс токены**: 16,384
- **Описание**: Специализированная модель для программирования
- **Применение**: Оптимизирована для генерации и анализа кода
- **Стоимость**: ₽134.64 входные, ₽536.11 выходные за 1K токенов

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

## 💰 Функции стоимости

### Получение стоимости модели

```javascript
// Получить стоимость конкретной модели
const cost = modelManager.getModelCost('gpt-4o');
console.log(cost);
// {
//   input: 612,
//   output: 2448,
//   currency: 'RUB',
//   unit: 'за 1K токенов'
// }
```

### Расчет стоимости запроса

```javascript
// Рассчитать стоимость запроса (1000 входных + 500 выходных токенов)
const requestCost = modelManager.calculateRequestCost('gpt-4o', 1000, 500);
console.log(requestCost);
// {
//   inputCost: 0.612,    // 1000 токенов = 1K = ₽612
//   outputCost: 1.224,   // 500 токенов = 0.5K = ₽1,224
//   totalCost: 1.836,    // Общая стоимость
//   currency: 'RUB'
// }
```

### Сортировка по стоимости

```javascript
// Получить модели, отсортированные по возрастанию стоимости
const cheapestFirst = modelManager.getModelsByCost('input', 'asc');
console.log('Самые дешевые входные токены:', cheapestFirst.slice(0, 3));
// ['gemini-1.5-flash', 'gemini-2.0-flash-lite', 'gpt-5-nano']

// По убыванию стоимости выходных токенов
const expensiveFirst = modelManager.getModelsByCost('output', 'desc');
console.log('Самые дорогие выходные токены:', expensiveFirst.slice(0, 3));
// ['claude-3-opus', 'gpt-4-turbo', 'gpt-4']
```

### Экономичные модели

```javascript
// Получить 5 самых экономичных моделей
const economical = modelManager.getMostEconomicalModels(5);
console.log('Самые экономичные модели:');
economical.forEach(model => {
  console.log(`${model.name}: ₽${model.cost.input} входные, ₽${model.cost.output} выходные`);
});

// Самые дорогие модели
const expensive = modelManager.getMostExpensiveModels(3);
console.log('Самые дорогие модели:');
expensive.forEach(model => {
  console.log(`${model.name}: ₽${model.cost.input} входные, ₽${model.cost.output} выходные`);
});
```

### Статистика по стоимости

```javascript
// Получить общую статистику по стоимости
const stats = modelManager.getCostStats();
console.log('Статистика стоимости:');
console.log(`Средняя стоимость входных токенов: ₽${stats.average.input}`);
console.log(`Средняя стоимость выходных токенов: ₽${stats.average.output}`);
console.log(`Общий диапазон: ₽${stats.range.min} - ₽${stats.range.max}`);
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
 * @property {Object} cost - Стоимость запроса
 * @property {string} notes - Дополнительные заметки
 */
```

### Структура стоимости

```javascript
/**
 * @typedef {Object} ModelCost
 * @property {number} input - Стоимость за 1K входных токенов
 * @property {number} output - Стоимость за 1K выходных токенов
 * @property {string} currency - Валюта (USD)
 * @property {string} unit - Единица измерения (per_1k_tokens)
 */
```

##  Использование

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

## 📊 Примеры использования

### Сравнение стоимости для разных задач

```javascript
// Сравнить стоимость обработки длинного документа (10K токенов)
const documentLength = 10000;
const models = ['gpt-4o', 'claude-3-sonnet', 'gemini-2.5-pro'];

models.forEach(modelId => {
  const cost = modelManager.calculateRequestCost(modelId, documentLength, documentLength * 0.3);
  console.log(`${modelId}: ₽${cost.totalCost.toFixed(2)}`);
});

// GPT-4o: ₽8.57
// claude-3-sonnet: ₽9.79
// gemini-2.5-pro: ₽3.67
```

### Выбор модели по бюджету

```javascript
// Найти модели в рамках бюджета (₽100 за 1K токенов)
const budget = 100;
const affordableModels = modelManager.getAllModels().filter(model => 
  model.cost.input <= budget && model.cost.output <= budget
);

console.log('Модели в рамках бюджета ₽100:');
affordableModels.forEach(model => {
  console.log(`${model.name}: ₽${model.cost.input} входные, ₽${model.cost.output} выходные`);
});
```

### Анализ по провайдерам

```javascript
// Сравнить среднюю стоимость по провайдерам
const providers = ['OpenAI', 'Anthropic', 'Google', 'DeepSeek'];

providers.forEach(provider => {
  const models = modelManager.getModelsByProvider(provider);
  const avgInput = models.reduce((sum, model) => sum + model.cost.input, 0) / models.length;
  const avgOutput = models.reduce((sum, model) => sum + model.cost.output, 0) / models.length;
  
  console.log(`${provider}: входные ₽${avgInput.toFixed(2)}, выходные ₽${avgOutput.toFixed(2)}`);
});
```

### Импорт и использование

```javascript
// Импорт всех настроек
const config = require('./src/config');

// Доступ к менеджеру моделей
const { modelManager } = config;

// Доступ к конфигурации LLM
const { llmConfig } = config;

// Удобные геттеры
const { getDefaultProvider, getProviderConfig } = config;
```

### Прямой импорт

```javascript
// Импорт конкретных модулей
const { modelManager, AVAILABLE_MODELS } = require('./src/config/models');
const { llmConfig } = require('./src/config/llm');
```
