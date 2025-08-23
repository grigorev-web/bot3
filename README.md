---
title: Telegram Bot - Личный ассистент с LLM
description: Телеграм бот личный ассистент с подключенным API LLM через ProxyAPI и памятью в базе данных
category: main
tags: [telegram, bot, nodejs, llm, ai, ассистент, база данных, память, proxyapi]
last_updated: 2024-01-01
author: Разработчик
version: 1.0.0
related_files: [src/app/app.js, src/handlers/index.js, src/modules/index.js]
---

# 🤖 Telegram Bot с LLM интеграцией

Современный Telegram бот с интеграцией Large Language Models (LLM) через ProxyAPI для умной обработки сообщений.

## ✨ Возможности

- **🤖 LLM интеграция** - работа с различными AI моделями через ProxyAPI
- **🧠 Умная классификация** - автоматическое определение типа сообщений
- **🔄 Автоматическое восстановление** - перезапуск при сетевых ошибках
- **📱 Поддержка медиа** - обработка текста, изображений, аудио
- **⚡ Ленивая загрузка** - LLM подключается только при необходимости
- **🛡️ Fallback система** - работает даже при недоступности LLM

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
git clone <your-repo-url>
cd bot3
npm install
```

### 2. Настройка окружения

Создайте `.env` файл на основе `env.example`:

```bash
# Telegram Bot
BOT_TOKEN=your_telegram_bot_token

# LLM API Configuration
LLM_PROVIDER=proxyApi
PROXYAPI_KEY=your_proxyapi_key_here
PROXYAPI_BASE_URL=https://openai.api.proxyapi.ru
PROXYAPI_MODEL=anthropic/claude-sonnet-4-20250514
PROXYAPI_MAX_TOKENS=1000
PROXYAPI_TEMPERATURE=0.7
PROXYAPI_TIMEOUT=30000
```

### 3. Запуск

```bash
# Разработка
npm run dev

# Продакшн
npm start
```

## 🔧 Архитектура

```
src/
├── app/           # Основное приложение
├── handlers/      # Обработчики сообщений
├── services/      # Внешние сервисы (LLM, БД)
├── modules/       # Логика бота
└── config/        # Конфигурация
```

### Ключевые компоненты

- **`LLMService`** - сервис для работы с ProxyAPI
- **`TextMessageHandler`** - обработка текстовых сообщений
- **`SmartRouter`** - умная маршрутизация сообщений
- **`MessageClassifier`** - классификация с помощью LLM

## 🌐 ProxyAPI интеграция

Бот использует [ProxyAPI](https://proxyapi.ru) для доступа к различным LLM провайдерам:

- **OpenAI** - GPT-4, GPT-3.5-turbo
- **Anthropic** - Claude Sonnet, Claude Haiku
- **Gemini** - Gemini Pro, Gemini Flash
- **DeepSeek** - DeepSeek Chat

### Преимущества ProxyAPI

- ✅ **Единый API** для всех провайдеров
- ✅ **OpenAI-совместимый** интерфейс
- ✅ **Автоматическая маршрутизация** по моделям
- ✅ **Европейские серверы** для стабильности

## 📚 Документация

Подробная документация находится в папке `docs/`:

- [📖 Обзор архитектуры](docs/architecture/overview.md)
- [🔌 API интеграция](docs/api/overview.md)
- [🤖 ProxyAPI интеграция](docs/api/proxyapi-integration.md)
- [🚀 Быстрый старт](docs/getting-started/installation.md)
- [💻 Примеры использования](docs/examples/basic-usage.md)

## 🛠️ Разработка

### Команды

```bash
# Запуск в режиме разработки
npm run dev

# Сборка
npm run build

# Тесты
npm test

# Линтинг
npm run lint
```

### Структура кода

- **JSDoc комментарии** для всех публичных методов
- **TypeScript-подобные типы** в комментариях
- **Модульная архитектура** с четким разделением ответственности
- **Обработка ошибок** с graceful fallback

## 🔒 Безопасность

- **Переменные окружения** для конфиденциальных данных
- **Валидация входящих данных** на всех уровнях
- **Ограничение доступа** к API ключам
- **Логирование** для аудита и отладки

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения с JSDoc комментариями
4. Создайте Pull Request

Подробные правила в [CONTRIBUTING.md](docs/contributing/development-rules.md).

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл.

## 🆘 Поддержка

- **Документация**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **ProxyAPI**: [proxyapi.ru](https://proxyapi.ru)

---

**Создано с ❤️ для умных Telegram ботов**
