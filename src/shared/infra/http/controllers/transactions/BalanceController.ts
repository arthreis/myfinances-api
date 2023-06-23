import { Request, Response } from 'express';

import { TransactionsRepository } from '../../../../../modules/transactions/repositories/TransactionsRepository';

export default class BalanceController {
  async index(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;

    const balance = await TransactionsRepository.getBalance(user_id);

    return res.json(balance);
  }
}
