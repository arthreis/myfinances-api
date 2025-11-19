# MyFinances API

Uma **API RESTful** para gerenciamento de finanças pessoais, construída com **Node.js, Express e TypeScript**.
Ela utiliza **TypeORM** para interagir com um banco de dados **PostgreSQL** e é facilmente configurada com **Docker Compose**.

---

## 🛠️ Pré-requisitos e Dependências

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas em seu sistema:

- [Node.js](https://nodejs.org/) (versão **18** ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## ⚙️ Instalação e Execução

Siga os passos abaixo para configurar e rodar a API no seu ambiente de desenvolvimento.

### Passo 1: Clone o repositório
Baixe o projeto para a sua máquina:

```bash
git clone git@github.com:arthreis/myfinances-api.git
cd myfinances-api
```

### Passo 2: Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto, baseado no template fornecido:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha as variáveis de acordo com suas configurações.

### Passo 3: Instale as dependências
```bash
npm install
```

### Passo 4: Inicie o banco de dados
Suba o container do banco em segundo plano com Docker Compose:

```bash
npm run docker:db
```

### Passo 5: Rode as migrações
Com o banco ativo, execute as migrações:

```bash
npm run migration:run
```

### Passo 6: Inicie a API
Inicie a API em modo de desenvolvimento:

```bash
npm run dev
```

A API estará rodando em:
👉 `http://localhost:[PORTA_DA_SUA_API]`

---

## 📜 Scripts Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia a API em modo desenvolvimento com hot-reloading. |
| `npm start` | Inicia a API em modo produção _(requer que o projeto esteja compilado)._|
| `npm run build` | Compila o código TypeScript para JavaScript _(gera `/dist`)_. |
| `npm run docker:db` | Sobe apenas o banco de dados com Docker. |
| `npm run migration:run` | Executa as migrações pendentes. |

---

## 🚀 CI/CD e Deploy Automatizado

O workflow `.github/workflows/ci-cd.yml` roda automaticamente em pushes para `develop` (staging) e `master` (produção) ou manualmente via **Run workflow**. O pipeline:

1. Executa testes (`quality` job).
2. Gera e publica uma imagem Docker multi-stage com tags por commit (`<sha>`) e por ambiente (`staging` ou `production`; `latest` é reservado para `master`).
3. Faz o deploy via SSH usando `docker-compose.deploy.yml`, mantendo staging e produção em portas distintas naquele mesmo servidor.

### Segredos / variáveis esperadas no GitHub

| Nome | Uso |
|------|-----|
| `APP_NAME` | Nome usado na tag da imagem (`<user>/<app>`). |
| `DOCKER_USERNAME`, `DOCKER_PASSWORD` | Login no Docker Hub. |
| `SERVER_HOST`, `SERVER_PORT`, `SERVER_USER`, `SERVER_SSH_KEY` | Acesso SSH ao Ubuntu Server (porta padrão `22`). |
| `SERVER_TARGET_DIR_STAGING`, `SERVER_TARGET_DIR_PRODUCTION` | Diretórios remotos para cada stack (ex.: `/srv/docker/myfinances/api/staging`). |
| `STAGING_PORT`, `PRODUCTION_PORT` | Portas expostas no host; escolha valores diferentes (ex.: `3334` e `3333`). |
| `vars.STAGING_URL`, `vars.PRODUCTION_URL` (opcional) | URLs exibidas na aba **Deployments** do GitHub. |

> Caso precise expor o Postgres externamente, adicione variáveis extras (`STAGING_DB_PORT`, `PRODUCTION_DB_PORT`) e exporte-as antes do `docker compose up`.

### Preparando o servidor Ubuntu

1. Instale Docker Engine + plugin Compose (`docker compose`).  
2. Crie os diretórios indicados nos segredos `SERVER_TARGET_DIR_*` e copie para cada um os arquivos `.env.production` e `.env.staging` (com valores reais). Esses arquivos **não** devem ser versionados no servidor público.  
3. Garanta que o usuário SSH esteja no grupo `docker` ou tenha permissão para executar os comandos do workflow.  
4. Para o primeiro deploy, basta executar um push nas branches correspondentes; o workflow fará `scp` do `docker-compose.deploy.yml`, fará login no Docker Hub e subirá/atualizará a stack com o nome (`STACK_NAME`) correto para evitar conflitos entre staging e produção.

---

## 📄 Licença

Este projeto está sob a licença **MIT**.
