---
title: Интеграция с ProxyAPI
description: Подробное руководство по интеграции Telegram бота с ProxyAPI для работы с LLM
category: api
tags: [proxyapi, llm, openai, integration]
last_updated: 2024-01-01
author: Telegram Bot Team
version: 2.0.0
related_files: [src/services/llm/llmService.js, env.example]
---

# Интеграция с ProxyAPI

## Обзор

ProxyAPI — это универсальное решение для доступа к API ведущих сервисов в области искусственного интеллекта, таких как OpenAI, Anthropic и Gemini. Сервис выступает в роли посредника: запросы отправляются на сервер ProxyAPI, который перенаправляет их через цепочку прокси-серверов в Европе.

## Как это работает

1. **Клиент отправляет запрос** к ProxyAPI на соответствующий эндпоинт
2. **ProxyAPI определяет провайдера** из URL и модели
3. **Запрос перенаправляется** к целевому LLM провайдеру
4. **Ответ возвращается** через ProxyAPI клиенту

## Преимущества

- **Единый API ключ** для всех LLM сервисов
- **Не требуется создавать аккаунты** в сторонних системах
- **Управление и оплата** происходит через личный кабинет ProxyAPI
- **Европейские прокси-серверы** для стабильности и скорости
- **Поддержка официальных библиотек** и SDK

## Конфигурация

### Переменные окружения

```bash
# LLM Provider
LLM_PROVIDER=proxyApi

# ProxyAPI Configuration
PROXYAPI_KEY=your_api_key_here
PROXYAPI_BASE_URL=https://api.proxyapi.ru

# Выберите модель (автоматически определит провайдера):
PROXYAPI_MODEL=gpt-3.5-turbo-0125
PROXYAPI_MAX_TOKENS=1000
PROXYAPI_TEMPERATURE=0.7
PROXYAPI_TIMEOUT=30000
```

### Доступные эндпоинты

| HTTP | Путь | Назначение |
|------|------|------------|
| POST | `/{provider}/v1/chat/completions` | Генерация текста |
| POST | `/{provider}/v1/embeddings` | Векторные представления |
| POST | `/{provider}/v1/images/generations` | Генерация изображений |
| POST | `/{provider}/v1/audio/transcriptions` | Расшифровка аудио |
| POST | `/{provider}/v1/audio/speech` | Генерация речи |

Где `{provider}` - один из: `openai`, `anthropic`, `google`, `deepseek`

## Адресация моделей

### Автоматическое определение провайдера

Наш `LLMService` автоматически определяет провайдера по названию модели:

| Провайдер | Префиксы моделей | Примеры |
|-----------|------------------|---------|
| **OpenAI** | `gpt-`, `o`, `dall-e`, `whisper`, `tts`, `text-embedding` | `gpt-3.5-turbo-0125`, `gpt-4o-mini`, `o3-mini` |
| **Anthropic** | `claude-`, `anthropic/` | `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022` |
| **Google** | `gemini-`, `google/` | `gemini-2.0-flash`, `gemini-2.5-flash` |
| **DeepSeek** | `deepseek-` | `deepseek-chat`, `deepseek-reasoner` |

### Популярные модели

#### OpenAI
- **GPT-3.5**: `gpt-3.5-turbo-0125` (самая доступная)
- **GPT-4o**: `gpt-4o-mini`, `gpt-4o`
- **O-модели**: `o3-mini`, `o3`, `o1-mini`

#### Anthropic
- **Claude 3.5**: `claude-3-5-sonnet-20241022`
- **Claude 3.5 Haiku**: `claude-3-5-haiku-20241022`
- **Claude 3.7**: `claude-3-7-sonnet-20250219`

#### Google
- **Gemini 2.0**: `gemini-2.0-flash`, `gemini-2.0-flash-lite`
- **Gemini 2.5**: `gemini-2.5-flash`, `gemini-2.5-pro`

#### DeepSeek
- **DeepSeek Chat**: `deepseek-chat`
- **DeepSeek Reasoner**: `deepseek-reasoner`

## Примеры использования

### cURL

```bash
# OpenAI GPT-3.5
curl "https://api.proxyapi.ru/openai/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <КЛЮЧ>" \
    -d '{
        "model": "gpt-3.5-turbo-0125",
        "messages": [
            {
                "role": "user",
                "content": "Привет!"
            }
        ]
    }'

# Anthropic Claude
curl "https://api.proxyapi.ru/anthropic/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <КЛЮЧ>" \
    -d '{
        "model": "claude-3-5-sonnet-20241022",
        "messages": [
            {
                "role": "user",
                "content": "Привет!"
            }
        ]
    }'
```

### Node.js

```javascript
// OpenAI
const response = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PROXYAPI_KEY}`
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo-0125',
        messages: [
            {
                role: 'user',
                content: 'Привет!'
            }
        ]
    })
});

// Anthropic
const response = await fetch('https://api.proxyapi.ru/anthropic/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PROXYAPI_KEY}`
    },
    body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
            {
                role: 'user',
                content: 'Привет!'
            }
        ]
    })
});
```

## Интеграция в боте

### LLMService

Наш `LLMService` автоматически:

1. **Читает конфигурацию** из переменных окружения
2. **Определяет провайдера** по названию модели
3. **Формирует правильный URL** для API запроса
4. **Отправляет запросы** к соответствующему эндпоинту
5. **Обрабатывает ответы** и возвращает результат

### Пример использования

```javascript
const llmService = new LLMService();
await llmService.initialize();

// Автоматически определит провайдера по модели
const response = await llmService.generateResponse('Привет, как дела?');
console.log(response.content);
```

## Обработка ошибок

### Типичные ошибки

- **401 Unauthorized** - неверный API ключ
- **400 Bad Request** - неверный формат запроса или неподдерживаемая модель
- **404 Not Found** - неправильный URL или эндпоинт
- **429 Too Many Requests** - превышен лимит запросов
- **500 Internal Server Error** - внутренняя ошибка сервера

### Fallback механизм

При ошибках API бот автоматически переключается на fallback ответы:

```javascript
try {
    const response = await llmService.generateResponse(prompt);
    return response.content;
} catch (error) {
    console.warn('⚠️ LLM недоступен, использую fallback:', error.message);
    return getDefaultResponse(prompt);
}
```

## Мониторинг и логирование

### Логи запросов

```javascript
console.log('🤖 Отправляю запрос к ProxyAPI...');
console.log('🤖 Данные запроса:', JSON.stringify(requestData, null, 2));
console.log('🤖 URL запроса:', `${this.config.apiUrl}/${this.config.modelProvider}/v1/chat/completions`);
console.log('🤖 Ответ от ProxyAPI:', JSON.stringify(responseData, null, 2));
```

### Метрики

- Время обработки запроса
- Количество использованных токенов
- Статус API доступности
- Количество ошибок по провайдерам

## Лучшие практики

1. **Используйте подходящие модели** для конкретных задач
2. **Мониторьте использование** API и токенов
3. **Обрабатывайте ошибки** gracefully с fallback ответами
4. **Тестируйте соединение** при инициализации
5. **Используйте кэширование** для повторяющихся запросов

## Тарифы

### Самые доступные модели

- **OpenAI**: `gpt-3.5-turbo-0125` - 122.40₽/запрос, 367.20₽/ответ
- **Anthropic**: `claude-3-5-haiku-20241022` - 244.80₽/запрос, 1,224₽/ответ
- **Google**: `gemini-2.0-flash-lite` - 18.36₽/запрос, 73.44₽/ответ
- **DeepSeek**: `deepseek-chat` - 66.10₽/запрос, 269.28₽/ответ

### Для разработки и тестирования

Рекомендуем начать с `gpt-3.5-turbo-0125` - это самая доступная и стабильная модель OpenAI.

## Поддержка

- [Официальная документация ProxyAPI](https://proxyapi.ru/docs)
- [Модели и тарифы](https://proxyapi.ru/pricing)
- [GitHub Issues](https://github.com/your-repo/issues)

---

**ProxyAPI предоставляет стабильный и безопасный доступ к ведущим LLM сервисам через единый API ключ.**
