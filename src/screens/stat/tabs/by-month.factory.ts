import { dayOfYear, daysAmount, getMonthNames, getNumberOfDaysInMonth } from 'utils/date';
import { CURRENT_YEAR, round, IRow, StatTab, TabTransition, notTotal, openRead, StatBook, withReads } from './shared';

export interface MonthRow extends IRow {
  key: string;
  days: number;
  rating: number;
}

function ByMonthFactory(books: StatBook[], year?: number): MonthRow[] {
  let result: MonthRow[] = getMonthNames().map((key, id) => ({
    id,
    key,
    d: getNumberOfDaysInMonth(id, year),
    count: 0,
    days: 0,
    rating: 0,
    items: [],
  }));
  const years = new Set<number>();

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
    result[month].items.push(book);
    years.add(book.year);
  });

  let total = 0;
  for (let y of years.values()) {
    total += daysAmount(y);
  }

  const currentMonth = getCurrentMonth();
  const hasCurrentYear = years.has(CURRENT_YEAR);
  const isCurrentYear = hasCurrentYear && year === CURRENT_YEAR;

  if (hasCurrentYear) {
    total = total - daysAmount() + dayOfYear();

    if (isCurrentYear) {
      result = result.slice(0, currentMonth + 1);
    }
  }

  result.push({
    id: 'total',
    key: 'total',
    count: totalCount * years.size,
    days: 0,
    rating: totalRating * years.size,
    d: total,
  });

  result.forEach((m, i) => {
    const size = hasCurrentYear && i > currentMonth && i < result.length - 1 ? years.size - 1 : years.size;
    const d = isCurrentYear && i === currentMonth ? getCurrentDay() : m.d;

    m.days = m.count ? round((d / m.count) * size) : 0;
    m.rating = m.count ? round(m.rating / m.count) : 0;
    m.count = m.count ? round(m.count / size) : 0;
  });

  return result;
}

function getCurrentMonth() {
  return new Date().getMonth();
}

function getCurrentDay() {
  return new Date().getDate();
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

    openRead(withReads(row, { date }), false);
  },
};

export const ByMonth: StatTab = {
  header: ['stat.month', 'stat.books', 'stat.days', 'stat.mark'],
  columns: ['name', 'count', 'days', 'rating'],
  flexes: [2, 1, 1, 1],
  factory: ByMonthFactory,
};
