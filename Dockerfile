FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json vite.config.js index.html ./
COPY scripts ./scripts
COPY src ./src
COPY public ./public

RUN npm ci
RUN npm run build

FROM caddy:2.10-alpine

COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
