import 'reflect-metadata';

import 'dotenv/config';
import cors from 'cors';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './shared/infra/http/routes/index.js';
import AppError from './shared/errors/AppError.js';
import ConfirmActionError from './shared/errors/ConfirmActionError.js';

import createConnection from './shared/infra/typeorm/index.js';
createConnection();

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
