import { getCurrentYear } from 'utils/date';
import { navigation } from 'services';

export const TABS = {
  MONTH: 'MONTH',
  AUTHOR: 'AUTHOR',
  RATING: 'RATING',
  YEAR: 'YEAR',
  TYPE: 'TYPE',
};

export interface StatTab {
  header: string[];
  columns: string[];
  flexes: number[];
  factory(books: StatBook[], year?: number): IRow[];
  allYears?: boolean;
}

export interface TabTransition {
  enabled(row: IRow, year: number): boolean;
  go(row: IRow, year: number);
}

export interface StatBook {
  year: number;
  month: number;
  date: Date;
  rating: number;
  paper: boolean;
  audio: boolean;
  withoutTranslation: boolean;
  leave: boolean;
  authors: string[];
}

export interface BookItems {
  items: StatBook[];
  minYear: number;
}

export interface IRow {
  id: number | string;
  count: number;
  d?: number;
  key?: string;
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
  const books = items.map(b => {
    const year = b.date.getFullYear();
    const month = b.date.getMonth();
    const authors = b.author ? b.author.split(', ') : [];

    if (year < minYear) {
      minYear = year;
    }

    return {
      year,
      month,
      authors,
      rating: b.rating,
      date: b.date,
      paper: b.paper,
      audio: b.audio,
      withoutTranslation: b.withoutTranslation,
      leave: b.leave,
    };
  });

  return { books, minYear };
}

export function notTotal(row) {
  return row.id !== 'total';
}

export function openRead(filters: any, year: number | false) {
  if (year) {
    filters.year = year;
  } else if (year !== false) {
    filters.minYear = true;
  }

  navigation.push('ReadList', { filters, sort: { field: 'date', desc: false }, readonly: true });
}

export type Sort = { field: string; asc: boolean };
