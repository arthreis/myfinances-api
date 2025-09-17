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

## 📄 Licença

Este projeto está sob a licença **MIT**.
