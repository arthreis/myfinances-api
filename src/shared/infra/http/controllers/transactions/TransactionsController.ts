import { Request, Response } from 'express';

import {TransactionsRepository} from '@/modules/transactions/repositories/TransactionsRepository.js';
import CreateTransactionService from '@/modules/transactions/services/CreateTransactionService.js';
import DeleteTransactionService from '@/modules/transactions/services/DeleteTransactionService.js';
import { Between } from 'typeorm';
import { addMonths, subMonths } from 'date-fns';
import UpdateTransactionService from '@/modules/transactions/services/UpdateTransactionService.js';

export default class TransactionsController {
  async store(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { title, value, type, category_id, transaction_date, description } = req.body;

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({
      user_id: id,
      title,
      value,
      type,
      category_id,
      transaction_date,
      description
    });

    return res.json(transaction);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { sort, direction, page, pageSize, period } = req.query;

    let take = 6;
    let skip = 0;
    let order: object = {
      transaction_date: 'DESC',
    };

    if (sort && direction) {
      order = {
        [sort as string]: direction,
      };
    }

    if (page && pageSize) {
      take = parseInt(pageSize as string, 10);
      skip = take * (parseInt(page as string, 10) - 1);

      if (skip < 0) skip = 0;
    }

    console.log(`PERIOD: ${period}`);
    const date = addMonths(new Date(period as string), 1);

    console.log(`PERIOD-DATE: ${date}`);


    const [transactions, total] = await TransactionsRepository.findAndCount({
      where: { user_id: id, transaction_date: Between(subMonths(date, 1), date) },
      relations: ['category'],
      order,
      take,
      skip,
    });

    return res.json({
      transactions,
      pageCount: Math.ceil(total / take),
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { id } = req.params;

    const deleteTransaction = new DeleteTransactionService();

    await deleteTransaction.execute({ user_id, id });

    return res.status(204).send();
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const { title, value, type, category_id, transaction_date, description } = req.body;
    const { id: transaction_id } = req.params;

    const updateTransactionService = new UpdateTransactionService();

    const transaction = await updateTransactionService.execute({
      user_id,
      transaction_id,
      title,
      value,
      type,
      category_id,
      transaction_date,
      description
    });

    return res.json(transaction);
  }
}
