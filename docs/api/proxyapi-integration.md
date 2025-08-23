---
title: Интеграция с ProxyAPI
description: Подробная документация по работе с ProxyAPI для доступа к LLM сервисам
category: api
tags: [api, proxyapi, llm, интеграция, openai, anthropic, gemini]
last_updated: 2024-01-01
author: Разработчик
version: 1.0.0
related_files: [src/services/llmService.js, env.example]
---

# Интеграция с ProxyAPI

## 🎯 Что такое ProxyAPI

**ProxyAPI** — это универсальное решение для доступа к API ведущих сервисов в области искусственного интеллекта, таких как OpenAI, Anthropic и Gemini. 

Сервис выступает в роли посредника: запросы отправляются на сервер ProxyAPI, который перенаправляет их через цепочку прокси-серверов в Европе. Мы получаем ответ от целевого сервиса и возвращаем его вам.

## 🚀 Преимущества использования ProxyAPI

- **Единый API ключ** для всех LLM сервисов
- **Не требуется создавать аккаунты** в сторонних системах
- **Управление и оплата** происходит через личный кабинет ProxyAPI
- **Европейские прокси-серверы** для стабильности и скорости
- **Поддержка официальных библиотек** и SDK
- **Автоматический fallback** при ошибках

## 🔑 Получение API ключа

### Регистрация
1. Перейдите на [proxyapi.ru](https://proxyapi.ru)
2. Зарегистрируйтесь в системе
3. Перейдите в раздел **"Ключи API"**
4. Создайте новый API ключ

### ⚠️ Важно
**Увидеть ключ целиком можно только один раз** — сразу после создания. Обязательно сохраните его в безопасном месте.

## 🔐 Авторизация

### Основной способ
Для любых запросов к ProxyAPI универсальным способом авторизации является передача ключа в заголовке:

```http
Authorization: Bearer <ВАШ_КЛЮЧ>
```

### Альтернативные способы
В целях поддержки официальных библиотек ProxyAPI также принимает другие формы авторизации:

```http
# Для Anthropic
x-api-key: <ВАШ_КЛЮЧ>

# Для Gemini (в строке запроса)
?key=<ВАШ_КЛЮЧ>
```

**В любом случае используйте именно ваш ключ ProxyAPI, а не ключи от оригинальных сервисов.**

## 🌐 Путь к API

### Базовый URL
```
https://api.proxyapi.ru
```

### Пути для разных провайдеров
В зависимости от провайдера, к которому идет обращение, после домена необходимо указывать соответствующий идентификатор:

- **OpenAI**: `https://api.proxyapi.ru/openai/v1`
- **Anthropic**: `https://api.proxyapi.ru/anthropic/v1`
- **Google Gemini**: `https://api.proxyapi.ru/google/v1`

## 📝 Примеры использования

### 1. OpenAI GPT через ProxyAPI

#### Запрос к моделям
```bash
curl -X GET "https://api.proxyapi.ru/openai/v1/models" \
  -H "Authorization: Bearer YOUR_PROXYAPI_KEY"
```

#### Генерация текста
```bash
curl -X POST "https://api.proxyapi.ru/openai/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_PROXYAPI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Привет! Как дела?"}
    ],
    "max_tokens": 1000,
    "temperature": 0.7
  }'
```

### 2. Anthropic Claude через ProxyAPI

#### Генерация текста
```bash
curl -X POST "https://api.proxyapi.ru/anthropic/v1/messages" \
  -H "x-api-key: YOUR_PROXYAPI_KEY" \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 1000,
    "messages": [
      {"role": "user", "content": "Расскажи о ProxyAPI"}
    ]
  }'
```

### 3. Google Gemini через ProxyAPI

#### Генерация текста
```bash
curl -X POST "https://api.proxyapi.ru/google/v1/models/text-bison:generateText?key=YOUR_PROXYAPI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": {
      "text": "Привет! Как дела?"
    }
  }'
```

## 🔧 Интеграция в проект

### Конфигурация (.env)
```bash
# ProxyAPI
PROXYAPI_KEY=your_proxyapi_key
PROXYAPI_URL=https://api.proxyapi.ru

# LLM настройки
LLM_MODEL=gpt-3.5-turbo
LLM_MAX_TOKENS=1000
LLM_TEMPERATURE=0.7
```

### LLM Service
```javascript
/**
 * @class LLMService
 * @description Сервис для работы с LLM API через ProxyAPI
 */
class LLMService {
  constructor(config) {
    this.apiKey = config.proxyapiKey;
    this.baseUrl = config.proxyapiUrl;
    this.model = config.llmModel;
    this.maxTokens = config.llmMaxTokens;
    this.temperature = config.llmTemperature;
  }

  /**
   * Генерирует ответ через OpenAI GPT
   * @param {string} prompt - Текст запроса
   * @param {Array} context - Контекст разговора
   * @returns {Promise<string>} Ответ от LLM
   */
  async generateOpenAIResponse(prompt, context = []) {
    const messages = [
      ...context,
      { role: 'user', content: prompt }
    ];

    const response = await fetch(`${this.baseUrl}/openai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Генерирует ответ через Anthropic Claude
   * @param {string} prompt - Текст запроса
   * @param {Array} context - Контекст разговора
   * @returns {Promise<string>} Ответ от LLM
   */
  async generateClaudeResponse(prompt, context = []) {
    const systemPrompt = context.length > 0 
      ? `Контекст разговора:\n${context.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\n`
      : '';

    const response = await fetch(`${this.baseUrl}/anthropic/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: this.maxTokens,
        messages: [
          { role: 'user', content: systemPrompt + prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  /**
   * Универсальный метод для генерации ответа
   * @param {string} prompt - Текст запроса
   * @param {Array} context - Контекст разговора
   * @param {string} provider - Провайдер (openai, claude, gemini)
   * @returns {Promise<string>} Ответ от LLM
   */
  async generateResponse(prompt, context = [], provider = 'openai') {
    try {
      switch (provider.toLowerCase()) {
        case 'openai':
          return await this.generateOpenAIResponse(prompt, context);
        case 'claude':
          return await this.generateClaudeResponse(prompt, context);
        case 'gemini':
          return await this.generateGeminiResponse(prompt, context);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error generating response with ${provider}:`, error);
      // Fallback на OpenAI
      if (provider !== 'openai') {
        return await this.generateOpenAIResponse(prompt, context);
      }
      throw error;
    }
  }
}
```

## 🚨 Обработка ошибок

### Типичные ошибки
```javascript
// Неверный API ключ
if (response.status === 401) {
  throw new Error('Invalid ProxyAPI key');
}

// Превышен лимит запросов
if (response.status === 429) {
  throw new Error('Rate limit exceeded');
}

// Ошибка сервера
if (response.status >= 500) {
  throw new Error('ProxyAPI server error');
}
```

### Retry логика
```javascript
async function generateResponseWithRetry(prompt, context, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await llmService.generateResponse(prompt, context);
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Ждем перед повторной попыткой
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## 📊 Мониторинг и логирование

### Логирование запросов
```javascript
// Логируем все запросы к ProxyAPI
logger.info('ProxyAPI request', {
  provider: 'openai',
  model: this.model,
  promptLength: prompt.length,
  contextLength: context.length,
  timestamp: new Date().toISOString()
});
```

### Метрики
- Количество запросов к каждому провайдеру
- Время ответа
- Количество ошибок
- Использование токенов

## 🔒 Безопасность

### Защита API ключа
- Никогда не коммитьте ключ в репозиторий
- Используйте переменные окружения
- Шифруйте ключ в продакшене
- Регулярно ротируйте ключи

### Валидация входящих данных
```javascript
function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt');
  }
  
  if (prompt.length > 10000) {
    throw new Error('Prompt too long');
  }
  
  // Проверка на вредоносный контент
  if (containsMaliciousContent(prompt)) {
    throw new Error('Malicious content detected');
  }
  
  return true;
}
```

## 📚 Дополнительные ресурсы

- [Официальная документация ProxyAPI](https://proxyapi.ru/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Anthropic API Reference](https://docs.anthropic.com/claude/reference)
- [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🆘 Поддержка

При возникновении проблем:

1. **Проверьте логи** на наличие ошибок
2. **Убедитесь в правильности API ключа**
3. **Проверьте лимиты** в личном кабинете ProxyAPI
4. **Обратитесь в поддержку** ProxyAPI
5. **Создайте issue** в нашем проекте

---

*ProxyAPI предоставляет стабильный и безопасный доступ к ведущим LLM сервисам. Для получения дополнительной информации обратитесь к [официальной документации](https://proxyapi.ru/docs).*
