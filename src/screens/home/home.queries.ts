import { Database, Q } from '@nozbe/watermelondb';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dayOfYear, getStartOfYear } from 'utils/date';

export function booksReadForecast(read: number, total: number): number {
  const yearProgress = dayOfYear() / 365;
  const needToRead = Math.round(yearProgress * total);

  return read - needToRead;
}

export function currentBooksQuery(database: Database) {
  return database.collections.get('books').query(Q.where('status', BOOK_STATUSES.NOW));
}

export function wishBooksQuery(database: Database) {
  return database.collections.get('books').query(Q.where('status', BOOK_STATUSES.WISH));
}

export function readBooksThisYearQuery(database: Database) {
  const queries = [Q.where('status', BOOK_STATUSES.READ), Q.where('date', Q.gte(getStartOfYear().getTime()))];
  return database.collections.get('books').query(Q.and(...queries));
}

export function readBooksQuery(database: Database) {
  return database.collections.get('books').query(Q.where('status', BOOK_STATUSES.READ));
}
