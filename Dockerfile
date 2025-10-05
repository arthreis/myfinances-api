# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
RUN npm install --ignore-scripts

COPY ./src ./src

RUN npm run build

# Etapa 2: Runtime
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
ENV APP_PORT=3333

EXPOSE 3333

CMD ["node", "dist/shared/infra/http/server.js"]
