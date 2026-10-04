# ФИНЛАБ — backend v1

Это первый рабочий backend-фундамент проекта. Frontend остаётся обычным HTML/CSS/JS, сервер — Node.js + Express, база — PostgreSQL.

## Что уже работает
- `/api/health` — проверка сервера и БД;
- регистрация пользователя API;
- вход по логину и паролю;
- HTTP-only cookie с JWT-сессией;
- выход;
- `/api/auth/me`;
- подключение ученика к классу по коду;
- таблицы пользователей, классов, модулей, заданий и попыток;
- начальные 6 модулей ФИНЛАБ.

## Локальный запуск
Требуется Node.js 20+ и Docker Desktop.

1. Запусти PostgreSQL:
   `docker compose up -d db`
2. Установи зависимости:
   `cd server && npm install`
3. Скопируй `server/.env.example` в `server/.env`.
4. Запусти:
   `npm run dev`
5. Открой `http://localhost:3000`.

Для продакшена поменяй `DATABASE_URL`, `JWT_SECRET` и `NODE_ENV=production`.
