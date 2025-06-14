# Repodar 🔍

**Repodar** — это веб-приложение для поиска пользователей и репозиториев GitHub с современным интерфейсом, кэшированием результатов и бесконечной прокруткой.

## 📖 Описание

Repodar представляет собой full-stack приложение, которое позволяет пользователям искать:
- **Пользователей GitHub** с дополнительной информацией о местоположении
- **Репозитории GitHub** с подробными метаданными

Приложение использует официальный GitHub API для получения данных и реализует интеллектуальное кэширование для повышения производительности и снижения нагрузки на API. Поддерживается пагинация с бесконечной прокруткой для удобного просмотра большого количества результатов.

## 🏗️ Архитектура

Проект построен по микросервисной архитектуре и состоит из следующих компонентов:

### Backend (Django REST API)
- **Фреймворк**: Django 4.2+ с Django REST Framework
- **База данных**: PostgreSQL 13
- **Кэширование**: Redis
- **API документация**: Swagger (drf-yasg)
- **Деплой**: Gunicorn + WhiteNoise

### Frontend (React SPA)
- **Фреймворк**: React 19 с TypeScript
- **Стилизация**: Styled Components
- **Анимации**: Vanta.js для 3D фона
- **Утилиты**: Lodash для debounce

### Infrastructure
- **Контейнеризация**: Docker + Docker Compose
- **Прокси**: Nginx (в production)
- **Переменные окружения**: .env файлы

## ✨ Особенности

- 🚀 **Высокая производительность** благодаря кэшированию результатов поиска
- 🎨 **Модернный UI** с 3D-анимированным фоном и стеклянными элементами
- 📱 **Адаптивный дизайн** для всех устройств
- 🔍 **Двойной поиск** по пользователям и репозиториям
- ⚡ **Дебаунсинг запросов** для оптимизации производительности
- 📄 **Пагинация с бесконечной прокруткой** для удобного просмотра результатов
- 🔐 **Поддержка GitHub токенов** для увеличения лимитов API
- 📚 **Автоматическая документация API** через Swagger
- 🧪 **Unit тесты** для критических компонентов

## 🚀 Быстрый старт

### Предварительные требования
- Docker и Docker Compose
- Make (опционально)

### Запуск проекта

1. **Клонируйте репозиторий**
   ```bash
   git clone <URL_репозитория>
   cd repodar
   ```

2. **Создайте файл переменных окружения**
   ```bash
   cp .env.example .env
   ```
   
   Отредактируйте `.env` файл, добавив необходимые переменные:
   ```env
   # GitHub API
   GITHUB_TOKEN=your_github_token_here
   
   # Database
   POSTGRES_DB=repodar
   POSTGRES_USER=repodar
   POSTGRES_PASSWORD=your_password
   
   # Ports
   BACKEND_PORT=8000
   FRONTEND_PORT=8080
   ```

3. **Запустите приложение**
   ```bash
   # Используя Make
   make build
   make up
   
   # Или напрямую через Docker Compose
   docker-compose build
   docker-compose up -d
   ```

4. **Доступ к приложению**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - Swagger документация: http://localhost:8000/swagger/

## 🛠️ Команды управления

```bash
# Сборка контейнеров
make build

# Запуск всех сервисов
make up

# Остановка всех сервисов
make down

# Запсук тестов
make test

# Просмотр логов
docker-compose logs -f

# Перестроение и перезапуск
docker-compose down && docker-compose build && docker-compose up -d
```

## 🔧 Разработка

### Backend разработка
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend разработка
```bash
cd frontend
npm install
npm start
```

### Тестирование
```bash
# Backend тесты
cd backend
python manage.py test

# Frontend тесты
cd frontend
npm test
```

## 📡 API Endpoints

### Поиск
- `POST /api/search/` - Поиск пользователей или репозиториев с пагинацией
  ```json
  {
    "query": "react",
    "type": "repo",
    "page": 1
  }
  ```
  
  **Ответ:**
  ```json
  {
    "items": [...],
    "page": 1,
    "per_page": 30,
    "total_count": 1000,
    "has_more": true
  }
  ```

### Очистка кэша
- `POST /api/clear-cache/` - Очистка кэша поиска

### Документация
- `GET /swagger/` - Swagger UI
- `GET /redoc/` - ReDoc документация

## 🎯 Технические детали

### Пагинация
- Поддержка до 34 страниц (ограничение GitHub API)
- По умолчанию 30 результатов на страницу
- Максимум 100 результатов на страницу
- Бесконечная прокрутка на frontend

### Кэширование
- Результаты поиска кэшируются на 2 часа
- Ключ кэша: `search:{type}:{query}:page:{page}`
- Каждая страница кэшируется отдельно
- Использует Redis для хранения

### GitHub API Integration
- Поддержка аутентификации через токен
- Автоматическое получение дополнительных данных пользователей
- Обработка rate limits и ошибок API
- Таймаут запросов: 10 секунд

### Frontend оптимизации
- Debounce поиска (300мс)
- Отмена предыдущих запросов при новых поисках
- Ленивая загрузка компонентов
- Оптимизированные анимации
- Infinite scroll с загрузкой при достижении 80% прокрутки
