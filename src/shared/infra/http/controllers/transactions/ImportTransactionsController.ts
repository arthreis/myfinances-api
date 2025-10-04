import { Request, Response } from 'express';

import ImportTransactionsService from '../../../../../modules/transactions/services/ImportTransactionsService';

export default class ImportTransactionsController {
  async store(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { path } = req.file as { path: string};

    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute({
      user_id: id,
      path,
    });

    return res.json(transactions);
  }
}
