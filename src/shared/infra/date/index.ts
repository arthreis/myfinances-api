import {
  isBefore,
  isEqual,
  getTime,
  addDays,
  subMonths,
  addWeeks,
  startOfWeek,
  endOfDay,
  lastDayOfMonth,
  format,
  startOfDay,
  parse,
} from 'date-fns';

import { utcToZonedTime } from 'date-fns-tz';

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
): any {
  let curr = startDate;
  const result = [];

  // while (isBefore(curr, endDate) || isEqual(curr, endDate)) {
  //   result.push(getTime(curr));
  //   curr = addFn[period](curr, 1);
  // }

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
  let baseDate;
  console.log(`Base date: ${date}`);
  console.log(`Base date: ${parse(date, 'yyyy-MM', new Date())}`);

  // parse(date, 'yyyy-MM', new Date());

  let endDate;
  let startDate;

  if (date) {
    baseDate = utcToZonedTime(new Date(parse(date, 'yyyy-MM', new Date())), 'America/Sao_Paulo');
    console.log('By month ...');
    // startDate = startOfDay(new Date(format(baseDate, 'yyyy-MM-01')));
    // endDate = lastDayOfMonth(endOfDay(baseDate));
    startDate = parse(date, 'yyyy-MM', new Date()), 'yyyy-MM-01';
    endDate = lastDayOfMonth(parse(date, 'yyyy-MM', new Date())), 'yyyy-MM-dd';
  } else {
    //TODO antigo
    // baseDate = utcToZonedTime(new Date(parse(date, 'yyyy-MM', new Date())), 'America/Sao_Paulo');
    // console.log('By week or month [original]...');
    // endDate = endOfDay(baseDate);
    // startDate = startFn[period](baseDate);

    baseDate = utcToZonedTime(new Date(parse(date, 'yyyy-MM', new Date())), 'America/Sao_Paulo');
    endDate = endOfDay(baseDate);
    startDate = startFn[period](baseDate);
  }

  return {
    startDate,
    endDate,
  };
}
