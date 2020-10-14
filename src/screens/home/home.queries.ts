import { Q } from '@nozbe/watermelondb';
import { map } from 'rxjs/internal/operators/map';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dayOfYear, getStartOfYear, daysAmount } from 'utils/date';
import { database } from 'store';

export function booksReadForecast(read: number, total: number): number {
  const yearProgress = dayOfYear() / daysAmount();
  const needToRead = Math.floor(yearProgress * total);

  return read - needToRead;
}

export function currentBooksQuery() {
  return database.collections.get('books').query(Q.where('status', BOOK_STATUSES.NOW));
}

export function wishBooksQuery() {
  return database.collections.get('books').query(Q.where('status', BOOK_STATUSES.WISH));
}

export function readBooksThisYearQuery() {
  const queries = [Q.where('status', BOOK_STATUSES.READ), Q.where('date', Q.gte(getStartOfYear().getTime()))];
  return database.collections.get('books').query(Q.and(...queries));
}

export function readBooksQuery() {
  return database.collections.get('books').query(Q.where('status', BOOK_STATUSES.READ));
}

export function lastReadDateObserver() {
  return database.collections
    .get('books')
    .query(Q.where('status', BOOK_STATUSES.READ), Q.experimentalSortBy('date', Q.desc), Q.experimentalTake(1))
    .observeWithColumns(['date'])
    .pipe(map(rows => rows[0].date));
}
