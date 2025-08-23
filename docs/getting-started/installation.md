---
title: Установка и настройка
description: Пошаговая инструкция по установке и настройке проекта
category: guides
tags: [установка, настройка, быстрый старт, разработка]
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

# База данных
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bot_db
DB_USER=bot_user
DB_PASSWORD=bot_password

# API ключи
API_KEY=your_api_key
BOT_TOKEN=your_bot_token

# Логирование
LOG_LEVEL=debug
LOG_FORMAT=detailed
```

### Конфигурационные файлы
- `src/config/development.js` - настройки для разработки
- `src/config/production.js` - настройки для продакшена
- `nodemon.json` - настройки автоперезагрузки

## 🔧 Настройка разработки

### 1. Настройка nodemon
```json
{
  "watch": ["src/"],
  "ext": "js,json",
  "ignore": ["node_modules/", "docs/"],
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
└── modules/       # Модули и роутинг
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
```

## 🔍 Отладка

### Логи
```bash
# Просмотр логов в реальном времени
tail -f logs/app.log

# Поиск ошибок
grep "ERROR" logs/app.log
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
      "envFile": "${workspaceFolder}/.env"
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

#### 3. Проблемы с правами
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
