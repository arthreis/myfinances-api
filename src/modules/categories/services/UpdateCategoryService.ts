import AppError from '../../../shared/errors/AppError.js';
import { dataSource } from '../../../shared/infra/typeorm/config/datasources/ormconfig.js';

import Category from '../entities/Category.js';

interface Request {
  user_id: string;
  category_id: string;
  title: string;
  icon: string;
  background_color_light: string;
  background_color_dark: string;
}

class UpdateCategoryService {
  async execute({
    user_id,
    category_id,
    title,
    icon,
    background_color_light,
    background_color_dark,
  }: Request): Promise<Category> {
    const categoryRepository = dataSource.getRepository(Category);

    let category = await categoryRepository.findOne({
      where: {
        user_id,
        id: category_id,
      },
    });

    if (!category) throw new AppError('Category not found');

    category = {
      ...category,
      title,
      icon,
      background_color_light,
      background_color_dark,
    };

    await categoryRepository.save(category);

    return category;
  }
}

export default UpdateCategoryService;
