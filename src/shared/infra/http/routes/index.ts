import { Router } from 'express';

import sessionsRouter from './sessions.routes';
import transactionsRouter from './transactions.routes';
import usersRouter from './users.routes';
import categoriesRouter from './categories.routes';
import homeRouter from './home.routes';
import healthRouter from './health.routes';
import metricsRouter from './metrics.routes';

const routes = Router();

routes.use('/', homeRouter);
routes.use('/healthcheck', healthRouter);
routes.use('/transactions', transactionsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/categories', categoriesRouter);
routes.use('/metrics', metricsRouter)

export default routes;
