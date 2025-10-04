import {
  isBefore,
  isEqual,
  getTime,
  addDays,
  addWeeks,
  startOfWeek,
  endOfDay,
  lastDayOfMonth,
  parse,
} from 'date-fns';

import { utcToZonedTime } from 'date-fns-tz';
import type { TimestampPeriod } from '../http/controllers/transactions/GetBalanceGraphController';

const periodUnitsDict = {
  month: 'week',
  week: 'day',
};

const addFn = {
  week: addDays,
  month: addWeeks,
};

export function generateDateRange(
  startDate: Date,
  endDate: Date,
  period: 'week' | 'month',
): TimestampPeriod {
  let curr = startDate;
  const result = [];

  while (isBefore(curr, endDate) || isEqual(curr, endDate)) {
    if (period === 'week') {
      result.push(getTime(curr));
      curr = addFn[period](curr, 1);
    } else {
      result.push(getTime(startFn[period](curr)));
      curr = addFn[period](curr, 1);
    }
  }

  return result;
}

export function getPeriodUnit(period: 'week' | 'month'): string {
  return periodUnitsDict[period];
}

interface PeriodDate {
  startDate: Date;
  endDate: Date;
}

const startFn = {
  week(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 });
  },
  month(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 });
  },
};

export function calculatePeriod(period: 'week' | 'month', date: string): PeriodDate {
  console.log(`Input date string for period calculation: ${date}`);
  const parsedDate = parseDate(date);
  const baseDate = convertToTimeZone(parsedDate, 'America/Sao_Paulo');

  if (period === 'month') {
    return calculateMonthPeriod(date, parsedDate);
  } else {
    return calculateWeekPeriod(baseDate, period);
  }
}

function parseDate(date: string): Date {
  const parsedDate = parse(date, 'yyyy-MM', new Date());
  if (!/^\d{4}-\d{2}$/.test(date) || isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date format: ${date}. Expected format: 'yyyy-MM'.`);
  }
  return parsedDate;
}

function convertToTimeZone(date: Date, timeZone: string): Date {
  return utcToZonedTime(date, timeZone);
}

function calculateMonthPeriod(date: string, parsedDate: Date): PeriodDate {
  const startDate = parse(`${date}-01`, 'yyyy-MM-dd', new Date());
  const endDate = lastDayOfMonth(parsedDate);
  return { startDate, endDate };
}

function calculateWeekPeriod(baseDate: Date, period: 'week' | 'month'): PeriodDate {
  const startDate = startFn[period](baseDate);
  const endDate = endOfDay(baseDate);
  return { startDate, endDate };
}
