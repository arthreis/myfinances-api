import { Router } from 'express';

import sessionsRouter from './sessions.routes.js';
import transactionsRouter from './transactions.routes.js';
import usersRouter from './users.routes.js';
import categoriesRouter from './categories.routes.js';
import homeRouter from './home.routes.js';
import healthRouter from './health.routes.js';

const routes = Router();

routes.use('/', homeRouter);
routes.use('/healthcheck', healthRouter);
routes.use('/transactions', transactionsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/categories', categoriesRouter);

export default routes;
