# PixiPod Leads API

1. Скопируйте `.env.example` в `.env`.
2. Создайте новый токен у BotFather и добавьте его как `TELEGRAM_BOT_TOKEN`.
3. Напишите боту `/start`, затем выполните `npm run find:chat` и сохраните найденный ID как `TELEGRAM_CHAT_ID`.
4. Запустите API командой `npm run start:dev`.

Фронтенд отправляет `POST /api/leads`; Vite проксирует этот маршрут на порт `3001`.
