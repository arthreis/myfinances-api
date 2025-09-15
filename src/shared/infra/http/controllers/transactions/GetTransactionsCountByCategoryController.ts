import { Request, Response } from 'express';

import { TransactionsRepository } from '../../../../../modules/transactions/repositories/TransactionsRepository.js';
import Category from '../../../../../modules/categories/entities/Category.js';
import { dataSource } from '../../../typeorm/config/datasources/ormconfig.js';

export default class GetTransactionsCountByCategoryController {
  async index(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { period } = req.query;
    const categoriesRepository = dataSource.getRepository(Category);

    const transactionsByCategory = await TransactionsRepository.getTransactionCountByCategory(
      user_id,
      period as string,
    );

    const categories = await categoriesRepository.find({
      where: {
        user_id,
      },
    });

    categories.forEach(category => {
      const found = transactionsByCategory.find(
        transactionCategory => transactionCategory.category_id === category.id,
      );

      if (found) {
        category.transactionsCount = parseInt(found.transactions, 10);
      }
    });

    return res.json(categories);
  }
}
