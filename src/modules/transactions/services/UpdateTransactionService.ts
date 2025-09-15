import AppError from '../../../shared/errors/AppError.js';

import {TransactionsRepository} from '../repositories/TransactionsRepository.js';

import Transaction from '../entities/Transaction.js';
import { dataSource } from '../../../shared/infra/typeorm/config/datasources/ormconfig.js';
import { parse } from 'date-fns';

interface Request {
  user_id: string;
  transaction_id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
  transaction_date: string;
  description: string;
}
class UpdateTransactionService {
  public async execute({
    user_id,
    title,
    type,
    value,
    category_id,
    transaction_id,
    transaction_date,
    description
  }: Request): Promise<Transaction> {
    const transactionRepository = dataSource.getRepository(Transaction);

    if (!['outcome', 'income'].includes(type)) throw new Error('Invalid type');

    let transaction = await transactionRepository.findOne({ where: { id : transaction_id } });

    if (transaction?.user_id !== user_id) {
      throw new AppError('Transaction is not yours');
    }

    console.log(`Transaction date: ${new Date(transaction_date)}`);


    transaction = TransactionsRepository.create({
      ...transaction,
      title,
      type,
      value,
      category_id,
      id: transaction_id,
      transaction_date: parse(transaction_date, 'yyyy-MM-dd', new Date()),
      description
    });

    await TransactionsRepository.update(transaction.id, transaction);

    return transaction;
  }
}

export default UpdateTransactionService;
