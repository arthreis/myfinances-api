import { Request, Response } from 'express';
import { Between } from 'typeorm';
import { isValid, lastDayOfMonth, endOfDay } from 'date-fns';

import { isValidFormatYYYYMM, parseYYYYMMtoDate } from '@/shared/infra/date';
import {TransactionsRepository} from '@/modules/transactions/repositories/TransactionsRepository';
import CreateTransactionService from '@/modules/transactions/services/CreateTransactionService';
import DeleteTransactionService from '@/modules/transactions/services/DeleteTransactionService';
import UpdateTransactionService from '@/modules/transactions/services/UpdateTransactionService';

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

    if (!isValidFormatYYYYMM(period as string)) {
      return res.status(400).json({
        message: 'O parâmetro "period" é obrigatório e deve estar no formato "yyyy-MM".'
      });
    }

    const firstDay = parseYYYYMMtoDate(period as string);

    if(!isValid(firstDay)) {
      return res.status(400).json({
        message: 'O parâmetro "period" está em um formato inválido.'
      })
    }

    const pageNumber = parseInt(page as string, 10) || 1;
    const size = parseInt(pageSize as string, 10) || 6;

    const take = size;
    const skip = take * (pageNumber - 1);

    let order: object = { transaction_date: 'DESC' };
    if (sort && direction) {
      order = { [sort as string]: direction };
    }

    const endOfLastDay = endOfDay(lastDayOfMonth(firstDay));

    const [transactions, total] = await TransactionsRepository.findAndCount({
      where: { user_id: id, transaction_date: Between(firstDay, endOfLastDay) },
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
