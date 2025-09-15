import { Router } from 'express';

import UsersController from '@controllers/users/UsersController.js';
import isAuthenticated from '@http/middlewares/isAuthenticated.js';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', usersController.store);
usersRouter.get('/me', isAuthenticated, usersController.show);

export default usersRouter;
