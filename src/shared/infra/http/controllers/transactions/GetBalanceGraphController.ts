import { Request, Response } from 'express';

import { TransactionsRepository } from '../../../../../modules/transactions/repositories/TransactionsRepository';
import {
  calculatePeriod,
  generateDateRange,
  getPeriodUnit,
} from '../../../date';
import { format } from 'date-fns';

interface BalanceGraphResponse {
  income: [[number, number]];
  outcome: [[number, number]];
}

export default class GetBalanceGraphController {
  async index(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    let { period } = req.query;
    const { date } = req.query;

    if (!period) period = 'week';

    const { startDate, endDate } = calculatePeriod(period as 'week' | 'month', date as string);

    const entries = await TransactionsRepository.getBalanceGraph(
      user_id,
      startDate,
      endDate,
      getPeriodUnit(period as 'week' | 'month'),
    );

    const dateRange = generateDateRange(
      startDate,
      endDate,
      period as 'week' | 'month',
    );

    const result: BalanceGraphResponse = {
      income: dateRange.map((date: number) => [date, 0]),
      outcome: dateRange.map((date: number) => [date, 0]),
    };

    const gmtBRT = 3600000 * 3;

    entries.forEach(entry => {
      const entryType = entry.type as 'income' | 'outcome';
      const foundIndex = result[entryType].findIndex(
        item => format(Number(item[0]), 'dd/MM/yyyy') === format(Number(entry.point)+Number(gmtBRT), 'dd/MM/yyyy'),
      );

      if (foundIndex >= 0) {
        const [oldPoint, oldValue] = result[entryType][foundIndex];
        result[entryType][foundIndex] = [
          oldPoint,
          oldValue + parseFloat(entry.value),
        ];
      }
    });

    return res.json(result);
  }
}
