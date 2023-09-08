import { Request, Response } from 'express';

import { TransactionsRepository } from '../../../../../modules/transactions/repositories/TransactionsRepository';
import Category from '../../../../../modules/categories/entities/Category';
import { dataSource } from '../../../typeorm/config/datasources/ormconfig';
import { Between } from 'typeorm';
import { addDays, addMonths, endOfDay } from 'date-fns';

export default class GetTransactionsOverviewController {
  async index(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { period } = req.query;
    const categoryRepository = dataSource.getRepository(Category);
    const promises = Promise.all([
      TransactionsRepository.getMaxTransactionValueByType(user_id, 'income', period as string),
      TransactionsRepository.getMaxTransactionValueByType(user_id, 'outcome', period as string),
      TransactionsRepository.getMostFrequentCategory(user_id, period as string),
    ]);

    const [income, outcome, mostFrequentCategoryId] = await promises;

    const category = await categoryRepository.findOne({where:{ id: mostFrequentCategoryId }});

    return res.json({
      income,
      outcome,
      category,
    });
  }
}
