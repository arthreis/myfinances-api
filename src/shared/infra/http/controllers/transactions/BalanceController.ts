import { Request, Response } from 'express';

import { TransactionsRepository } from '../../../../../modules/transactions/repositories/TransactionsRepository.js';

export default class BalanceController {
  async index(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;

    const { period } = req.query;

    const balance = await TransactionsRepository.getBalanceByPeriod(user_id, period as string);

    return res.json(balance);
  }
}
