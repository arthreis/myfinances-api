import { Request, Response } from 'express';
import { format } from 'date-fns';

import { TransactionsRepository } from '../../../../../modules/transactions/repositories/TransactionsRepository';
import {
  calculatePeriod,
  generateDateRange,
  getWeekValue,
  WeekStartsDict,
  type Period,
  type WeekStartKey,
} from '../../../date';

interface IncomeOutcomeData {
  income: [number, number][];
  outcome: [number, number][];
}

export type TimestampPeriod = number[];

export default class GetBalanceGraphController {
  async index(req: Request, res: Response): Promise<Response> {

    const { id: user_id } = req.user;
    const { period } = req.query;
    const { date } = req.query;
    let { weekStartsOn } = req.query;

    if (!period || (period !== 'week' && period !== 'day')) {
      return res.status(400).json({
        message: `O parâmetro "period" é obrigatório e deve ser "week" ou "month". [${period}]`,
      });
    }

    if (!date) {
      return res.status(400).json({
        message: `O parâmetro "date" é obrigatório e deve estar no formato "yyyy-MM". [${date}]`,
      });
    }

    weekStartsOn = weekStartsOn as WeekStartKey || 'sunday';

    if (weekStartsOn && weekStartsOn in WeekStartsDict === false) {
      return res.status(400).json({
        message: `O parâmetro "weekStartsOn" deve ser "sunday", "monday", "tuesday", "wednesday", "thursday", "friday" ou "saturday". [${weekStartsOn}]`,
      });
    }

    const { startDate, endDate } = calculatePeriod(date as string);

    const accumulatedTransactions = await TransactionsRepository.getBalanceGraph(
      user_id,
      startDate,
      endDate,
      period as Period,
      getWeekValue(weekStartsOn as WeekStartKey),
    );

    const chartTimestamps: TimestampPeriod = generateDateRange(
      startDate,
      endDate,
      period as Period,
      getWeekValue(weekStartsOn as WeekStartKey),
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
