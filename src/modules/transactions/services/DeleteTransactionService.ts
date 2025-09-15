import { TransactionsRepository } from '../repositories/TransactionsRepository.js';

import AppError from '../../../shared/errors/AppError.js';

interface Request {
  user_id: string;
  id: string;
}

class DeleteTransactionService {
  public async execute({ user_id, id }: Request): Promise<void> {

    const transaction = await TransactionsRepository.findOne({
      where: { id, user_id },
    });

    if (!transaction) throw new AppError('Transaction not found');

    await TransactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
