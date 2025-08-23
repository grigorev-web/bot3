---
title: Установка и настройка
description: Пошаговая инструкция по установке и настройке проекта
category: guides
tags: [установка, настройка, быстрый старт, разработка, llm, proxyapi, база данных]
last_updated: 2024-01-01
author: Разработчик
version: 1.0.0
related_files: [package.json, env.example, nodemon.json]
---

# Установка и настройка

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- Git
- **База данных** (PostgreSQL/MySQL/SQLite)
- **API ключ ProxyAPI**

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Установка зависимостей
```bash
npm install
# или
yarn install
```

### 3. Настройка окружения
```bash
# Копируем пример конфигурации
cp env.example .env

# Редактируем .env файл
nano .env
```

### 4. Запуск в режиме разработки
```bash
# Запуск с nodemon (автоперезагрузка)
npm run dev

# Обычный запуск
npm start
```

## ⚙️ Конфигурация

### Переменные окружения (.env)
```bash
# Основные настройки
NODE_ENV=development
PORT=3000

# Telegram Bot
BOT_TOKEN=your_bot_token_here

# ProxyAPI
PROXYAPI_KEY=your_proxyapi_key
PROXYAPI_URL=https://api.proxyapi.ru

# LLM настройки
LLM_MODEL=gpt-3.5-turbo
LLM_MAX_TOKENS=1000
LLM_TEMPERATURE=0.7

# База данных (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=assistant_db
DB_USER=assistant_user
DB_PASSWORD=assistant_password

# База данных (MySQL - удаленное подключение)
# DB_TYPE=mysql
# DB_HOST=your-mysql-server.com
# DB_PORT=3306
# DB_NAME=assistant_db
# DB_USER=assistant_user
# DB_PASSWORD=assistant_password
# DB_SSL=true

# Логирование
LOG_LEVEL=debug
LOG_FORMAT=detailed
LOG_FILE=./logs/app.log

# Память и контекст
MEMORY_MAX_MESSAGES=50
MEMORY_MAX_TOKENS=4000
CONTEXT_WINDOW=10
```

### Конфигурационные файлы
- `src/config/development.js` - настройки для разработки
- `src/config/production.js` - настройки для продакшена
- `nodemon.json` - настройки автоперезагрузки

## 🔑 Получение API ключей

### 1. Telegram Bot Token
1. Откройте Telegram и найдите @BotFather
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Скопируйте полученный токен в файл `.env`

### 2. ProxyAPI ключ
1. Зарегистрируйтесь на [proxyapi.ru](https://proxyapi.ru)
2. Перейдите в раздел "Ключи API"
3. Создайте новый API ключ
4. Скопируйте ключ в `PROXYAPI_KEY`

## 🗄️ Настройка базы данных

### PostgreSQL (рекомендуется)

#### 1. Установка
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Скачайте с https://www.postgresql.org/download/windows/
```

#### 2. Создание базы данных
```bash
# Подключаемся к PostgreSQL
sudo -u postgres psql

# Создаем пользователя
CREATE USER assistant_user WITH PASSWORD 'assistant_password';

# Создаем базу данных
CREATE DATABASE assistant_db OWNER assistant_user;

# Даем права
GRANT ALL PRIVILEGES ON DATABASE assistant_db TO assistant_user;

# Выходим
\q
```

#### 3. Создание таблиц
```sql
-- Подключаемся к базе данных
\c assistant_db

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица разговоров
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сообщений
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    role VARCHAR(50) NOT NULL, -- 'user' или 'assistant'
    content TEXT NOT NULL,
    tokens INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица памяти
CREATE TABLE memories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    key VARCHAR(255) NOT NULL,
    value TEXT,
    importance INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_memories_user_id ON memories(user_id);
```

### SQLite (для разработки)

#### 1. Создание папки для данных
```bash
mkdir -p data
```

#### 2. Создание базы данных
```bash
# SQLite создаст базу автоматически при первом подключении
touch data/assistant.db
```

## 🔧 Настройка разработки

### 1. Настройка nodemon
```json
{
  "watch": ["src/"],
  "ext": "js,json",
  "ignore": ["node_modules/", "docs/", "data/"],
  "exec": "node src/index.js"
}
```

### 2. Настройка линтера
```bash
# Установка ESLint
npm install --save-dev eslint

# Создание конфигурации
npx eslint --init
```

### 3. Настройка тестов
```bash
# Установка Jest
npm install --save-dev jest

# Добавление скрипта в package.json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

## 📁 Структура проекта

```
src/
├── app/           # Основное приложение
├── config/        # Конфигурация
├── handlers/      # Обработчики сообщений
├── modules/       # Модули и роутинг
├── services/      # Сервисы
│   ├── llmService.js      # LLM API интеграция через ProxyAPI
│   ├── memoryService.js   # Управление памятью
│   └── databaseService.js # Работа с БД
└── models/        # Модели данных
    ├── User.js           # Пользователь
    ├── Conversation.js   # Разговор
    └── Memory.js         # Память
```

## 🚀 Первый запуск

### 1. Проверка установки
```bash
# Проверяем версию Node.js
node --version

# Проверяем npm
npm --version

# Проверяем зависимости
npm list --depth=0
```

### 2. Запуск приложения
```bash
npm run dev
```

### 3. Проверка работоспособности
```bash
# Проверяем API
curl http://localhost:3000/api/health

# Проверяем статус
curl http://localhost:3000/api/system/status

# Проверяем подключение к БД
curl http://localhost:3000/api/system/database
```

## 🔍 Отладка

### Логи
```bash
# Просмотр логов в реальном времени
tail -f logs/app.log

# Поиск ошибок
grep "ERROR" logs/app.log

# Поиск LLM запросов через ProxyAPI
grep "ProxyAPI" logs/app.log
```

### Отладка в VS Code/Cursor
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/src/index.js",
      "envFile": "${workspaceFolder}/.env",
      "console": "integratedTerminal"
    }
  ]
}
```

## 🧪 Тестирование

### Запуск тестов
```bash
# Все тесты
npm test

# Тесты с покрытием
npm run test:coverage

# Тесты в режиме watch
npm run test:watch
```

### Структура тестов
```
tests/
├── unit/          # Модульные тесты
├── integration/   # Интеграционные тесты
└── e2e/           # End-to-end тесты
```

## 📦 Сборка для продакшена

### 1. Сборка
```bash
npm run build
```

### 2. Проверка
```bash
npm run lint
npm test
```

### 3. Запуск
```bash
NODE_ENV=production npm start
```

## 🚨 Решение проблем

### Частые ошибки

#### 1. Порт занят
```bash
# Поиск процесса на порту 3000
lsof -i :3000

# Завершение процесса
kill -9 <PID>
```

#### 2. Проблемы с зависимостями
```bash
# Очистка кэша npm
npm cache clean --force

# Удаление node_modules
rm -rf node_modules package-lock.json

# Переустановка
npm install
```

#### 3. Проблемы с базой данных
```bash
# Проверка статуса PostgreSQL
sudo systemctl status postgresql

# Перезапуск PostgreSQL
sudo systemctl restart postgresql

# Проверка подключения
psql -h localhost -U assistant_user -d assistant_db
```

#### 4. Проблемы с ProxyAPI
```bash
# Проверка API ключа
curl -H "Authorization: Bearer YOUR_PROXYAPI_KEY" \
     https://api.proxyapi.ru/openai/v1/models

# Проверка лимитов
# Обратитесь в личный кабинет ProxyAPI
```

#### 5. Проблемы с правами
```bash
# Изменение прав на папку
chmod -R 755 .

# Изменение владельца
sudo chown -R $USER:$USER .
```

## 📚 Дополнительные ресурсы

- [Архитектура проекта](../architecture/overview.md)
- [API документация](../api/overview.md)
- [Руководство по разработке](../guides/development.md)
- [Решение проблем](../troubleshooting/common-issues.md)

## 🆘 Получение помощи

- Создайте issue в GitHub
- Обратитесь к документации
- Проверьте логи приложения
- Используйте отладчик

---

*Если у вас возникли проблемы, обратитесь к разделу [Решение проблем](../troubleshooting/common-issues.md).*
