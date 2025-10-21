import {
  isBefore,
  isEqual,
  getTime,
  addDays,
  addWeeks,
  startOfWeek,
  endOfDay,
  lastDayOfMonth,
  parseISO,
} from 'date-fns';

import type { TimestampPeriod } from '../http/controllers/transactions/GetBalanceGraphController';

const periodUnitsDict = {
  month: 'week',
  week: 'day',
} as const;

const addFn = {
  week: addDays,
  month: addWeeks,
};

export function generateDateRange(
  startDate: Date,
  endDate: Date,
  period: 'week' | 'month',
): TimestampPeriod {
  let currentDate = startDate;
  const result = [];

  while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {

    if (period === 'week') {
      result.push(getTime(currentDate));
      currentDate = addFn[period](currentDate, 1);
    } else {
      result.push(getTime(startOfWeek(currentDate, { weekStartsOn: 0 })));
      currentDate = addFn[period](currentDate, 1);
    }
  }
  return result;
}

export function getPeriodUnit(period: 'week' | 'month'): 'day' | 'week' {
  return periodUnitsDict[period];
}

interface PeriodDate {
  startDate: Date;
  endDate: Date;
}

export function calculatePeriod(date: string): PeriodDate {
  return calculateMonthPeriod(date);
}

export function parseYYYYMMtoDate(date: string): Date {
  const parsedDate = parseISO(date)
  if (!/^\d{4}-\d{2}$/.test(date) || isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date format: ${date}. Expected format: 'yyyy-MM'.`);
  }
  return parsedDate;
}

function calculateMonthPeriod(date: string): PeriodDate {
  const startDate = parseISO(date);
  const endDate = endOfDay(lastDayOfMonth(startDate));
  return { startDate, endDate };
}

export function isValidFormatYYYYMM(yyyyMM: string): boolean {
  if (!yyyyMM || typeof yyyyMM !== 'string' || yyyyMM.length !== 7 || !/^\d{4}-\d{2}$/.test(yyyyMM)) {
    return false;
  } else {
    return true
  }
}
