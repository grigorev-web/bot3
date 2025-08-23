---
title: Структура модулей с LLM классификацией
description: Подробное описание новой архитектуры модулей для умной классификации сообщений
category: architecture
tags: [modules, llm, classifier, router, architecture]
last_updated: 2024-01-01
author: Telegram Bot Team
version: 2.0.0
related_files: [src/modules/**/*.js, src/config/llm.js]
---

# Архитектура модулей и сервисов

## 🏗️ Общая структура

Проект организован по принципу разделения ответственности:

- **`src/modules/`** - Логические модули бота (роутер, классификатор)
- **`src/services/`** - Внешние сервисы (API, базы данных)
- **`src/handlers/`** - Обработчики сообщений Telegram
- **`src/config/`** - Конфигурационные файлы
- **`src/app/`** - Основное приложение

## 📦 Модули (src/modules/)

Модули содержат основную логику бота:

### Router Module (`src/modules/router/`)
- **SmartRouter** - Умный роутер сообщений с LLM классификацией
- **Responsibility**: Маршрутизация сообщений по категориям
- **Features**: LLM классификация + паттерн-матчинг + fallback

### Classifier Module (`src/modules/classifier/`)
- **MessageClassifier** - Классификатор сообщений с использованием LLM
- **Responsibility**: Определение категории входящего сообщения
- **Features**: Предопределенные категории + LLM классификация

## 🔌 Сервисы (src/services/)

Сервисы обеспечивают взаимодействие с внешними системами:

### LLM Service (`src/services/llm/`)
- **LLMService** - Сервис для работы с LLM API через ProxyAPI
- **Responsibility**: Взаимодействие с внешними LLM API
- **Features**: ProxyAPI интеграция + fallback + кэширование

## 🔄 Архитектурные принципы

### 1. Разделение ответственности
- **Модули** = Логика бота
- **Сервисы** = Внешние API и базы данных
- **Handlers** = Обработка Telegram сообщений

### 2. Dependency Injection
- Модули используют сервисы через dependency injection
- Сервисы не зависят от модулей
- Четкое разделение слоев

### 3. Fallback система
- Многоуровневая система fallback
- Graceful degradation при ошибках
- Работа бота даже без внешних сервисов

## 📊 Потоки данных

```
Telegram Message → Handler → Router → Classifier → LLM Service → ProxyAPI
                                    ↓
                              Pattern Matching (fallback)
                                    ↓
                              Simple Router (fallback)
                                    ↓
                              Stub Router (last resort)
```

## 🔧 Конфигурация

### LLM Service Configuration
```javascript
// src/config/llm.js
const llmConfig = {
  defaultProvider: 'proxyApi',
  providers: {
    proxyApi: {
      apiUrl: process.env.PROXYAPI_URL,
      model: process.env.PROXYAPI_MODEL,
      // ... другие настройки
    }
  }
};
```

### Environment Variables
```bash
# LLM Provider
LLM_PROVIDER=proxyApi

# ProxyAPI Configuration
PROXYAPI_KEY=your_proxyapi_key_here
PROXYAPI_URL=https://api.proxyapi.com/v1
PROXYAPI_MODEL=gpt-3.5-turbo
```

## 🚀 Использование

### Инициализация модулей
```javascript
// В TextMessageHandler
const { SmartRouter } = require('../modules');
const llmConfig = require('../config/llm');

this.router = new SmartRouter(llmConfig, options);
await this.router.initialize();
```

### Использование сервисов
```javascript
// В модулях
const LLMService = require('../../services/llm/llmService');
const llmService = new LLMService(config);
```

## 📈 Мониторинг и расширяемость

### Добавление новых модулей
1. Создать папку в `src/modules/`
2. Реализовать основную логику
3. Добавить в `src/modules/index.js`
4. Обновить документацию

### Добавление новых сервисов
1. Создать папку в `src/services/`
2. Реализовать API взаимодействие
3. Добавить в `src/services/index.js`
4. Обновить конфигурацию

## 🎯 Преимущества новой архитектуры

1. **Четкое разделение**: Логика бота отделена от внешних сервисов
2. **Легкое тестирование**: Модули можно тестировать без внешних зависимостей
3. **Простое расширение**: Новые сервисы добавляются без изменения логики
4. **Fallback система**: Бот работает даже при недоступности внешних API
5. **Конфигурируемость**: Все настройки вынесены в конфигурационные файлы

Архитектура готова для интеграции с реальными LLM API и может быть легко расширена для новых сценариев использования.
