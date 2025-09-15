import { Router } from 'express';

import isAuthenticated from '@http/middlewares/isAuthenticated.js';
import CategoriesController from '@controllers/categories/CategoriesController.js';

const categoriesRouter = Router();
categoriesRouter.use(isAuthenticated);

const categoriesController = new CategoriesController();

categoriesRouter.get('/', categoriesController.index);
categoriesRouter.get('/:id', categoriesController.show);
categoriesRouter.post('/', categoriesController.create);
categoriesRouter.put('/:id', categoriesController.update);
categoriesRouter.delete('/:id', categoriesController.delete);

export default categoriesRouter;
