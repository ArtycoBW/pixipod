# PixiPod

Сайт независимой цифровой студии PixiPod: стратегия, дизайн, разработка и движение в одном продукте.

## Запуск

```bash
npm install
npm run dev
```

Сайт будет доступен на `http://localhost:5173`.

## Заявки

Серверная часть на NestJS находится в [`server`](./server). Она принимает `POST /api/leads` и пересылает заявки в Telegram.

```bash
npm --prefix server install
Copy-Item server/.env.example server/.env
npm run server:dev
```

Токен бота и идентификатор чата задаются только в `server/.env`; этот файл не попадает в репозиторий.

## Сборка

```bash
npm run build
npm run server:build
```
