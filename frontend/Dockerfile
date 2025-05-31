# Etapa 1: Build
FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Etapa 2: Container leve apenas com arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
