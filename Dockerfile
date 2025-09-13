# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /usr/src/app

# Copia apenas os arquivos necessários para instalar dependências
COPY package*.json tsconfig.json ./

# Instala dependências (sem dev para build mais limpo)
RUN npm install

# Copia o código-fonte
COPY ./src ./src

# Compila TypeScript → dist
RUN npm run build

# Etapa 2: Runtime
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia apenas os arquivos de produção
COPY package*.json ./

# Instala só dependências de produção
RUN npm install --omit=dev

# Copia o build da etapa anterior o essencial para rodar o app em produção
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Variáveis default (podem ser sobrescritas no docker-compose)
ENV NODE_ENV=production
ENV APP_PORT=3000

EXPOSE 3000

# Comando de start
CMD ["node", "dist/shared/infra/http/server.js"]
