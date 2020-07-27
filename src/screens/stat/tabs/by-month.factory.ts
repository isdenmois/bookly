import { dayOfYear } from 'utils/date';
import { CURRENT_YEAR, round, IRow, StatTab, TabTransition, notTotal, openRead, StatBook } from './shared';

export interface MonthRow extends IRow {
  name: string;
  days: number;
  rating: number;
}

const MONTHS = [
  { id: 0, name: 'Январь', d: 31 },
  { id: 1, name: 'Февраль', d: 28 },
  { id: 2, name: 'Март', d: 31 },
  { id: 3, name: 'Апрель', d: 30 },
  { id: 4, name: 'Май', d: 31 },
  { id: 5, name: 'Июнь', d: 30 },
  { id: 6, name: 'Июль', d: 31 },
  { id: 7, name: 'Август', d: 31 },
  { id: 8, name: 'Сентябрь', d: 30 },
  { id: 9, name: 'Октябрь', d: 31 },
  { id: 10, name: 'Ноябрь', d: 30 },
  { id: 11, name: 'Декабрь', d: 31 },
];

function ByMonthFactory(books: StatBook[], year: number): MonthRow[] {
  let result: MonthRow[] = MONTHS.map(m => ({ ...m, count: 0, days: 0, rating: 0 }));
  const years = new Set();

  if (year) {
    years.add(year);
  }

  let totalCount = 0;
  let totalRating = 0;

  books.forEach(book => {
    const month = book.month;

    totalCount++;
    totalRating += book.rating;
    result[month].count++;
    result[month].rating += book.rating;
    years.add(book.year);
  });

  let total = years.size * 365;
  const currentMonth = new Date().getMonth();
  const hasCurrentYear = years.has(CURRENT_YEAR);

  if (hasCurrentYear) {
    total = total - 365 + dayOfYear();

    if (year === CURRENT_YEAR) {
      result = result.slice(0, currentMonth + 1);
    }
  }

  result.push({
    id: 'total',
    name: 'Итого',
    count: totalCount * years.size,
    days: 0,
    rating: totalRating * years.size,
    d: total,
  });

  result.forEach((m, i) => {
    const size = hasCurrentYear && i > currentMonth && i < result.length - 1 ? years.size - 1 : years.size;

    m.days = m.count ? round((m.d / m.count) * size) : 0;
    m.rating = m.count ? round(m.rating / m.count) : 0;
    m.count = m.count ? round(m.count / size) : 0;
  });

  return result;
}

export const transition: TabTransition = {
  enabled(row, year) {
    return year && notTotal(row);
  },
  go(row: MonthRow, year: number) {
    const date = {
      from: new Date(year, <number>row.id, 1, 11, 1, 1),
      to: new Date(year, <number>row.id + 1, 0, 13, 0, 0),
    };

    openRead({ date }, false);
  },
};

export const ByMonth: StatTab = {
  header: ['stat.month', 'stat.books', 'stat.days', 'stat.mark'],
  columns: ['name', 'count', 'days', 'rating'],
  flexes: [2, 1, 1, 1],
  factory: ByMonthFactory,
};
