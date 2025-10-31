import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { env } from './env';
import AppError from './shared/errors/AppError';
import ConfirmActionError from './shared/errors/ConfirmActionError';
import routes from './shared/infra/http/routes';
import createConnection from './shared/infra/typeorm';
import { metricsMiddleware } from './shared/infra/http/middlewares/metricsMiddleware';

if (env.NODE_ENV !== 'test') {
  createConnection()
    .then(async (dataSource) => {
      console.log(`✅ Data Source [${env.NODE_ENV}] inicializado com sucesso!`);

      try {
        const [{ timezone, now }] = await dataSource.query(`
          SELECT current_setting('TIMEZONE') AS timezone, now() AS now;
        `);

        console.log('🕒 PostgreSQL timezone:', timezone);
        console.log('🕒 PostgreSQL now():', now);
        console.log('🕒 Node.js timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
        console.log('🕒 Node.js now():', new Date().toISOString());
      } catch (err) {
        console.error('⚠️ Erro ao consultar timezone no banco: ', err);
      }
    }).catch((error) => {
    console.error('Erro durante a inicialização do Data Source: ', error);
  });
} else {
  console.log('Rodando em ambiente de teste, pulando a inicialização do Data Source.');
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);
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
