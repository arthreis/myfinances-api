import Category from '../entities/Category';
import { dataSource } from '../../../shared/infra/typeorm/config/datasources/ormconfig';

interface Request {
  user_id: string;
  title: string;
  icon: string;
  color: string;
}

class CreateCategoryService {
  async execute({
    user_id,
    title,
    icon,
    color,
  }: Request): Promise<Category> {
    const categoriesRepository = dataSource.getRepository(Category);

    const category = categoriesRepository.create({
      user_id,
      title,
      icon,
      color,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
