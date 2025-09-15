import Transaction from '../entities/Transaction.js';
import { dataSource } from '../../../shared/infra/typeorm/config/datasources/ormconfig.js';
import { format } from 'date-fns';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionsGroupedByCategory {
  category_id: string;
  transactions: string;
}

export const TransactionsRepository = dataSource.getRepository(Transaction).extend(
  {
    async getBalance(user_id: string): Promise<Balance> {
      const transactions = await this.find({ where: { user_id } });

      const defaultObject: Balance = {
        total: 0.0,
        income: 0.0,
        outcome: 0.0,
      };

      const balance = transactions.reduce((acc, current): Balance => {
        if (current.type === 'income') acc.income += current.value;
        else acc.outcome += current.value;

        return acc;
      }, defaultObject);

      balance.total = balance.income - balance.outcome;
      return balance;
    },
    async getBalanceByPeriod(user_id: string, period: string): Promise<Balance> {
      const transactions = await this.createQueryBuilder('transactions',)
      .select('*')
      .where('transactions.user_id = :user_id', { user_id })
      .andWhere("to_char(transactions.transaction_date, 'YYYY-MM') = :period", { period })
      .getRawMany();

      const defaultObject: Balance = {
        total: 0.0,
        income: 0.0,
        outcome: 0.0,
      };

      const balance = transactions.reduce((acc, current): Balance => {
        if (current.type === 'income') {
          acc.income += Number(current.value);
        } else {
          acc.outcome += Number(current.value);
        }
        return acc;
      }, defaultObject);

      balance.total = Number(Number(balance.income - balance.outcome).toFixed(2));
      return balance;
    },
    async getTransactionCountByCategory(user_id: string, period: string): Promise<TransactionsGroupedByCategory[]> {
      const transactionsGroupedByCategory = await this.createQueryBuilder('transactions',)
        .select('category_id')
        .addSelect('COUNT(*)', 'transactions')
        .where('transactions.user_id = :user_id', { user_id })
        .andWhere("to_char(transactions.transaction_date, 'YYYY-MM') = :period", { period })
        .groupBy('transactions.category_id')
        .getRawMany();

      return transactionsGroupedByCategory;
    },
    async getTransactionTotalValueByCategory2(user_id: string, period: string): Promise<TransactionsGroupedByCategory[]> {
      const transactionsGroupedByCategory = await this.createQueryBuilder('transactions',)
        .select('category_id')
        .addSelect('SUM(transactions.value)', 'transactions')
        .where('transactions.user_id = :user_id', { user_id })
        .andWhere("to_char(transactions.transaction_date, 'YYYY-MM') = :period", { period })
        .groupBy('transactions.category_id')
        .getRawMany();

      return transactionsGroupedByCategory;
    },
    async getTransactionTotalValueByCategory(user_id: string, period: string, type: string): Promise<TransactionsGroupedByCategory[]> {
      const transactionsGroupedByCategory = this.createQueryBuilder('transactions')
        .select('category_id')
        .addSelect('SUM(transactions.value)', 'transactions')
        .where('transactions.user_id = :user_id', { user_id })
        .andWhere("to_char(transactions.transaction_date, 'YYYY-MM') = :period", { period })
        .groupBy('transactions.category_id');

        if (type) {
          transactionsGroupedByCategory.andWhere('transactions.type = :type', { type })
        }

      return await transactionsGroupedByCategory.getRawMany();
    },
    async getMaxTransactionValueByType(
      user_id: string,
      type: 'income' | 'outcome',
      period: string,
    ): Promise<number> {
      const data = await this.createQueryBuilder('transactions')
        .select('MAX(value)', 'value')
        .where('transactions.user_id = :user_id', { user_id })
        .andWhere('transactions.type = :type', { type })
        .andWhere("to_char(transactions.transaction_date, 'YYYY-MM') = :period", { period })
        .getRawOne();

        return data.value;
      },
    async getMostFrequentCategory(user_id: string, period: string): Promise<string> {
        const { category_id } = await this.createQueryBuilder('transactions')
        .select('category_id')
        .addSelect('COUNT(*)', 'count')
        .where('transactions.user_id = :user_id', { user_id })
        .andWhere("to_char(transactions.transaction_date, 'YYYY-MM') = :period", { period })
        .groupBy('transactions.category_id')
        .orderBy('2', 'DESC')
        .getRawOne() || '';

      return category_id;
    },
    async getBalanceGraph(
      user_id: string,
      startDate: Date,
      endDate: Date,
      unit = 'day',
    ): Promise<any[]> {
      const entries = await this.createQueryBuilder('transactions')
        .select(
          `EXTRACT(EPOCH FROM date_trunc(:unit, transaction_date)) * 1000`,
          'point',
        )
        .addSelect('type')
        .addSelect('SUM(value)', 'value')
        .where('user_id = :user_id', { user_id })
        .andWhere('transaction_date BETWEEN :startDate AND :endDate', {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        })
        .setParameter('unit', unit)
        .orderBy('1')
        .groupBy('1')
        .addGroupBy('2')
        .getRawMany();

      return entries;
    }
  },
);
