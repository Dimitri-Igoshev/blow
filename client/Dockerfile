# Сборка
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install --legacy-peer-deps
COPY . .
RUN npm list @emoji-mart/react || echo "Не удалось найти @emoji-mart/react"
RUN npm run build

# Продакшн-сервер
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./
RUN npm install --legacy-peer-deps

EXPOSE 3000
CMD ["npm", "start"]