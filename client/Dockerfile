# Сборка
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Продакшн-сервер
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./
RUN npm install --production --legacy-peer-deps

EXPOSE 3000
CMD ["npm", "start"]