# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
RUN npm install --ignore-scripts

# Copia o código-fonte
COPY ./src ./src

# Compila TypeScript → dist
RUN npm run build

# ---

# Etapa 2: Runtime
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia apenas o que é essencial para rodar o app:
# - package.json para referência e para scripts
# - node_modules com as dependências instaladas
# - o build da aplicação em dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
ENV APP_PORT=3000

EXPOSE 3000

# Comando de start
CMD ["node", "dist/shared/infra/http/server.js"]
