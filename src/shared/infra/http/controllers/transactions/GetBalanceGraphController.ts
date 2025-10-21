import { Request, Response } from 'express';
import { format } from 'date-fns';

import { TransactionsRepository } from '../../../../../modules/transactions/repositories/TransactionsRepository';
import {
  calculatePeriod,
  generateDateRange,
  getPeriodUnit,
} from '../../../date';

interface IncomeOutcomeData {
  income: [number, number][];
  outcome: [number, number][];
}

export type TimestampPeriod = number[];

export type Period = 'week' | 'month';

export default class GetBalanceGraphController {
  async index(req: Request, res: Response): Promise<Response> {

    const { id: user_id } = req.user;
    const { period } = req.query;
    const { date } = req.query;

    const { startDate, endDate } = calculatePeriod(date as string);

    const accumulatedTransactions = await TransactionsRepository.getBalanceGraph(
      user_id,
      startDate,
      endDate,
      getPeriodUnit(period as Period),
    );

    const chartTimestamps: TimestampPeriod = generateDateRange(
      startDate,
      endDate,
      period as Period,
    );

    const chartDataByType: IncomeOutcomeData = {
      income: chartTimestamps.map((date: number) => [date, 0]),
      outcome: chartTimestamps.map((date: number) => [date, 0]),
    };

    accumulatedTransactions.forEach(transaction => {
      const transactionType = transaction.type as 'income' | 'outcome';
      const transactionDateIndex = chartDataByType[transactionType].findIndex(
        item => {
          // checks if the graph point data has an associated transaction date
          const chartDisplayDate = format(Number(item[0]), 'dd/MM/yyyy');
          const transactionPointDate = format(Number(transaction.point), 'dd/MM/yyyy');

          return chartDisplayDate === transactionPointDate;
        }
      );

      const hasTransactionOnChartDate = transactionDateIndex >= 0;

      if (hasTransactionOnChartDate) {
        const [oldPoint, oldValue] = chartDataByType[transactionType][transactionDateIndex];
        chartDataByType[transactionType][transactionDateIndex] = [
          oldPoint,
          oldValue + parseFloat(transaction.value),
        ];
      }
    });
    return res.json(chartDataByType);
  }
}
