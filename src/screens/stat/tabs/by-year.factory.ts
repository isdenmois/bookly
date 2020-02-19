import _ from 'lodash';
import {
  CURRENT_YEAR,
  dayOfYear,
  round,
  IRow,
  FactoryProps,
  StatTab,
  TabTransition,
  notTotal,
  openRead,
} from './shared';

interface YearRow extends IRow {
  rating: number;
  days: number;
}

function ByYearFactory({ books }: FactoryProps): YearRow[] {
  const result: YearRow[] = [{ id: CURRENT_YEAR, count: 0, rating: 0, days: 0, d: dayOfYear() }];
  let totalCount = 0;
  let totalRating = 0;
  let totalD = result[0].d;

  books.forEach(book => {
    const year = book.year;
    const i = CURRENT_YEAR - year;

    if (!result[i]) {
      result[i] = { id: year, count: 0, rating: 0, days: 0, d: 365 };
      totalD += 365;
    }

    totalCount++;
    totalRating += book.rating;
    result[i].count++;
    result[i].rating += book.rating;
  });

  books = books.filter(_.identity);

  result.push({
    id: 'Итого',
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
    openRead({ year: row.id }, false);
  },
};

export const ByYear: StatTab = {
  header: ['Год', 'Книг', 'Дней', 'Оценка'],
  columns: ['id', 'count', 'days', 'rating'],
  flexes: [2, 1, 1, 1],
  factory: ByYearFactory,
};
