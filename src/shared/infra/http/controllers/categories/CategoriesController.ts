import { Request, Response } from 'express';

import Category from '../../../../../modules/categories/entities/Category';

import CreateCategoryService from '../../../../../modules/categories/services/CreateCategoryService';
import UpdateCategoryService from '../../../../../modules/categories/services/UpdateCategoryService';
import DeleteCategoryService from '../../../../../modules/categories/services/DeleteCategoryService';
import AppError from '../../../../errors/AppError';
import { dataSource } from '../../../typeorm/config/datasources/ormconfig';

export default class CategoriesController {
  async index(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const categoriesRepository = dataSource.getRepository(Category);

    const categories = await categoriesRepository.find({
      where: {
        user_id,
      },
    });

    return res.json(categories);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { id } = req.query;

    const categoriesRepository = dataSource.getRepository(Category);
    const category = await categoriesRepository.findOne(
      {
        where: {
          user_id,
          id: id?.toString(),
        },
      }
    );

    if (!category) {
      throw new AppError('Category not found');
    }

    return res.json(category);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const {
      title,
      icon,
      color,
    } = req.body;

    const createCategoryService = new CreateCategoryService();

    const category = await createCategoryService.execute({
      user_id,
      title,
      icon,
      color,
    });

    return res.json(category);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { id: category_id } = req.params;
    const {
      title,
      icon,
      color,
    } = req.body;

    const updateCategoryService = new UpdateCategoryService();

    const category = await updateCategoryService.execute({
      user_id,
      category_id,
      title,
      icon,
      color,
    });

    return res.json(category);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { id: category_id } = req.params;
    const { isConfirmed = false } = req.query;

    const deleteCategoryService = new DeleteCategoryService();

    await deleteCategoryService.execute({
      user_id,
      category_id,
      isConfirmed: isConfirmed as boolean,
    });

    return res.status(204).send();
  }
}
