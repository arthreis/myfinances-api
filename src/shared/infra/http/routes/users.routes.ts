import { Router } from 'express';

import UsersController from '@/shared/infra/http/controllers/users/UsersController.js';
import isAuthenticated from '@/shared/infra/http/middlewares/isAuthenticated.js';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', usersController.store);
usersRouter.get('/me', isAuthenticated, usersController.show);

export default usersRouter;
