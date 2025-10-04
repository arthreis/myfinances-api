import { Request, Response } from 'express';

import { TransactionsRepository } from '../../../../../modules/transactions/repositories/TransactionsRepository';
import Category from '../../../../../modules/categories/entities/Category';
import { dataSource } from '../../../typeorm/config/datasources/ormconfig';

export default class GetTransactionsValueByCategoryController {
  async index(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { period, type } = req.query;
    const categoriesRepository = dataSource.getRepository(Category);

    const transactionsByCategory = await TransactionsRepository.getTransactionTotalValueByCategory(
      user_id,
      period as string,
      type as string,
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
        category.transactionsTotalValue = Number(found.transactions);
      }
    });

    return res.json(categories);
  }
}
