import { getCurrentYear } from 'utils/date';

export interface StatBook {
  year: number;
  month: number;
  date: Date;
  rating: number;
  authors: string[];
}

export interface BookItems {
  items: StatBook[];
  minYear: number;
}

export interface IRow {
  id: number | string;
  d?: number;
}

export interface FactoryProps {
  books: StatBook[];
  year: number;
}

export const CURRENT_YEAR = getCurrentYear();

export function byYear(year) {
  const start = new Date(year, 0, 1, 0, 0, 0);
  const end = new Date(year, 11, 31, 23, 59, 59);

  return book => book.date >= start && book.date <= end;
}

export function round(n: number) {
  return Math.round(n * 10) / 10;
}

export function dayOfYear() {
  const start = new Date(CURRENT_YEAR, 0, 0).getTime();
  const diff = new Date().getTime() - start;
  const oneDay = 1000 * 60 * 60 * 24;

  return Math.floor(diff / oneDay);
}

export function mapBooks(items: any[]) {
  let minYear = CURRENT_YEAR;
  items = items.map(b => {
    const year = b.date.getFullYear();
    const month = b.date.getMonth();
    const authors = b.author ? b.author.split(', ') : [];

    if (year < minYear) {
      minYear = year;
    }

    return { year, month, rating: b.rating, date: b.date, authors };
  });

  return { items, minYear };
}
