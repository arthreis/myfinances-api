import cors from 'cors';
import { env } from './env';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './shared/infra/http/routes';
import AppError from './shared/errors/AppError';
import ConfirmActionError from './shared/errors/ConfirmActionError';

import createConnection from './shared/infra/typeorm';

if (env.NODE_ENV !== 'test') {
  createConnection().then(() => {
    console.log(`Data Source [${env.NODE_ENV}] inicializado com sucesso!`);
  }).catch((error) => {
    console.error('Erro durante a inicialização do Data Source: ', error);
  });
} else {
  console.log('Rodando em ambiente de teste, pulando a inicialização do Data Source.');
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err: Error, _request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  if (err instanceof ConfirmActionError) {
    return response.status(err.statusCode).json({
      status: 'confirm',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
