---
title: Обзор API
description: Основные принципы и структура API проекта
category: api
tags: [api, эндпоинты, запросы, ответы, аутентификация]
last_updated: 2024-01-01
author: Разработчик
version: 1.0.0
related_files: [src/app/app.js, src/handlers/commandHandlers.js]
---

# Обзор API

## 🌐 Базовый URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## 🔑 Аутентификация

### Типы аутентификации
- **Bearer Token**: Для API запросов
- **Session**: Для веб-интерфейса
- **Bot Token**: Для бот-интеграций

### Получение токена
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

## 📡 Основные принципы

### HTTP методы
- **GET**: Получение данных
- **POST**: Создание новых ресурсов
- **PUT**: Полное обновление ресурса
- **PATCH**: Частичное обновление
- **DELETE**: Удаление ресурса

### Форматы данных
- **Request**: JSON
- **Response**: JSON
- **Content-Type**: `application/json`

### Коды ответов
- **200**: Успешный запрос
- **201**: Ресурс создан
- **400**: Ошибка в запросе
- **401**: Не авторизован
- **403**: Доступ запрещен
- **404**: Не найдено
- **500**: Внутренняя ошибка сервера

## 🏗️ Структура API

### Основные группы эндпоинтов

#### 1. Аутентификация (`/api/auth`)
- `POST /auth/login` - Вход в систему
- `POST /auth/logout` - Выход из системы
- `POST /auth/refresh` - Обновление токена
- `GET /auth/profile` - Профиль пользователя

#### 2. Сообщения (`/api/messages`)
- `GET /messages` - Получение сообщений
- `POST /messages` - Отправка сообщения
- `GET /messages/:id` - Получение конкретного сообщения
- `PUT /messages/:id` - Обновление сообщения
- `DELETE /messages/:id` - Удаление сообщения

#### 3. Команды (`/api/commands`)
- `GET /commands` - Список доступных команд
- `POST /commands/execute` - Выполнение команды
- `GET /commands/:id` - Информация о команде

#### 4. Модули (`/api/modules`)
- `GET /modules` - Список модулей
- `GET /modules/:id` - Информация о модуле
- `POST /modules/:id/enable` - Включение модуля
- `POST /modules/:id/disable` - Отключение модуля

#### 5. Система (`/api/system`)
- `GET /system/status` - Статус системы
- `GET /system/health` - Проверка здоровья
- `GET /system/metrics` - Метрики системы
- `POST /system/restart` - Перезапуск системы

## 📝 Примеры запросов

### Отправка сообщения
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Привет, мир!",
    "type": "text",
    "recipient": "user123"
  }'
```

### Выполнение команды
```bash
curl -X POST http://localhost:3000/api/commands/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "command": "help",
    "parameters": {
      "category": "general"
    }
  }'
```

### Получение статуса системы
```bash
curl -X GET http://localhost:3000/api/system/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔄 WebSocket API

### Подключение
```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Подключено к WebSocket');
  
  // Аутентификация
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'YOUR_TOKEN'
  }));
};
```

### Типы сообщений
- **auth**: Аутентификация
- **message**: Новое сообщение
- **command**: Результат выполнения команды
- **system**: Системные уведомления
- **error**: Ошибки

### Пример WebSocket сообщения
```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'message':
      console.log('Новое сообщение:', data.message);
      break;
    case 'command':
      console.log('Результат команды:', data.result);
      break;
    case 'error':
      console.error('Ошибка:', data.error);
      break;
  }
};
```

## 📊 Пагинация

### Параметры пагинации
- `page`: Номер страницы (начиная с 1)
- `limit`: Количество элементов на странице
- `sort`: Поле для сортировки
- `order`: Порядок сортировки (`asc` или `desc`)

### Пример с пагинацией
```bash
curl -X GET "http://localhost:3000/api/messages?page=1&limit=20&sort=createdAt&order=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Ответ с пагинацией
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## 🔍 Фильтрация и поиск

### Поиск по тексту
```bash
curl -X GET "http://localhost:3000/api/messages?search=привет" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Фильтрация по типу
```bash
curl -X GET "http://localhost:3000/api/messages?type=text&status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Фильтрация по дате
```bash
curl -X GET "http://localhost:3000/api/messages?from=2024-01-01&to=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Rate Limiting

### Лимиты запросов
- **Аутентифицированные пользователи**: 1000 запросов/час
- **Неаутентифицированные**: 100 запросов/час
- **API ключи**: 10000 запросов/час

### Headers для rate limiting
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📚 Дополнительные ресурсы

- [Детальная документация эндпоинтов](endpoints.md)
- [Примеры использования](examples.md)
- [Аутентификация и безопасность](authentication.md)
- [Обработка ошибок](errors.md)

---

*API постоянно развивается. Следите за обновлениями в [changelog](../changelog.md).*
