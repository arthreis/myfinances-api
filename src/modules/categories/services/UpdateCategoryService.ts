import AppError from '../../../shared/errors/AppError';
import { dataSource } from '../../../shared/infra/typeorm/config/datasources/ormconfig';

import Category from '../entities/Category';

interface Request {
  user_id: string;
  category_id: string;
  title: string;
  icon: string;
  color: string;
}

class UpdateCategoryService {
  async execute({
    user_id,
    category_id,
    title,
    icon,
    color,
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
      color,
    };

    await categoryRepository.save(category);

    return category;
  }
}

export default UpdateCategoryService;
