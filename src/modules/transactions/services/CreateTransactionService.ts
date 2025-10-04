import AppError from '../../../shared/errors/AppError';

import {TransactionsRepository} from '../repositories/TransactionsRepository';

import Transaction from '../entities/Transaction';
import Category from '../../categories/entities/Category';
import { dataSource } from '../../../shared/infra/typeorm/config/datasources/ormconfig';
import { parse } from 'date-fns';

interface Request {
  user_id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
  transaction_date: string,
  description: string
}
class CreateTransactionService {
  public async execute({
    user_id,
    title,
    type,
    value,
    category_id,
    transaction_date,
    description
  }: Request): Promise<Transaction> {
    const categoryRepository = dataSource.getRepository(Category);

    if (!['outcome', 'income'].includes(type)) throw new Error('Invalid type');

    // if (type === 'outcome') {
    //   const { total } = await TransactionsRepository.getBalance(user_id);

    //   if (total < value) throw new AppError('Insufficient Balance');
    // }

    const category = await categoryRepository.findOne({ where: { id : category_id } });

    if (!category) throw new AppError('Invalid Category');

    const transaction = TransactionsRepository.create({
      user_id,
      title,
      type,
      value,
      category_id,
      transaction_date: parse(transaction_date, 'yyyy-MM-dd', new Date()),
      description
    });

    await TransactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
