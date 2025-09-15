import Category from '../entities/Category.js';
import { dataSource } from '../../../shared/infra/typeorm/config/datasources/ormconfig.js';

interface Request {
  user_id: string;
  title: string;
  icon: string;
  background_color_light: string;
  background_color_dark: string;
}

class CreateCategoryService {
  async execute({
    user_id,
    title,
    icon,
    background_color_light,
    background_color_dark,
  }: Request): Promise<Category> {
    const categoriesRepository = dataSource.getRepository(Category);

    const category = categoriesRepository.create({
      user_id,
      title,
      icon,
      background_color_light,
      background_color_dark,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
