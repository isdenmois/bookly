import _ from 'lodash';
import {
  CURRENT_YEAR,
  dayOfYear,
  round,
  IRow,
  StatTab,
  TabTransition,
  notTotal,
  openRead,
  StatBook,
  withReads,
} from './shared';
import { daysAmount } from 'utils/date';

interface YearRow extends IRow {
  rating: number;
  days: number;
}

function ByYearFactory(books: StatBook[]): YearRow[] {
  let result: YearRow[] = [{ id: CURRENT_YEAR, count: 0, rating: 0, days: 0, d: dayOfYear(), items: [] }];
  let totalCount = 0;
  let totalRating = 0;
  let totalD = result[0].d;

  books.forEach(book => {
    const year = book.year;
    const i = CURRENT_YEAR - year;
    const amount = daysAmount(year);

    if (!result[i]) {
      result[i] = { id: year, count: 0, rating: 0, days: 0, d: amount, items: [] };
      totalD += amount;
    }

    totalCount++;
    totalRating += book.rating;
    result[i].count++;
    result[i].rating += book.rating;
    result[i].items.push(book);
  });

  result = result.filter(_.identity);

  result.push({
    id: 'total',
    key: 'total',
    rating: totalRating,
    count: totalCount,
    days: 0,
    d: totalD,
  });

  result.forEach(y => {
    y.days = y.count ? round(y.d / y.count) : 0;
    y.rating = y.count ? round(y.rating / y.count) : 0;
  });

  return result;
}

export const transition: TabTransition = {
  enabled: notTotal,
  go(row) {
    openRead(withReads(row, { year: row.id }), false);
  },
};

export const ByYear: StatTab = {
  header: ['year', 'stat.books', 'stat.days', 'stat.mark'],
  columns: ['id', 'count', 'days', 'rating'],
  flexes: [2, 1, 1, 1],
  factory: ByYearFactory,
  allYears: true,
};
