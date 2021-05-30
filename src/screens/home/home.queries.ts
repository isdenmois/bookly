import { Q } from '@nozbe/watermelondb';
import { map } from 'rxjs/internal/operators/map';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dayOfYear, getStartOfYear, daysAmount } from 'utils/date';
import { database } from 'store';
import Book from 'store/book';
import List from 'store/list';
import { settings } from 'services';
import _ from 'lodash';

const INITIAL_SORT = { field: 'title', desc: false };
const getDefaultSort = () => {
  const sort = settings.defaultSort || INITIAL_SORT;
  const field = _.snakeCase(sort.field);

  return Q.experimentalSortBy(field, sort.desc ? Q.desc : Q.asc);
};

export function booksReadForecast(read: number, total: number): number {
  const yearProgress = dayOfYear() / daysAmount();
  const needToRead = Math.floor(yearProgress * total);

  return read - needToRead;
}

export function currentBooksQuery() {
  return database.collections
    .get<Book>('books')
    .query(Q.where('status', BOOK_STATUSES.NOW), Q.experimentalSortBy('updated_at', Q.asc));
}

export function wishBooksQuery() {
  return database.collections.get<Book>('books').query(Q.where('status', BOOK_STATUSES.WISH), getDefaultSort());
}

export function readBooksThisYearQuery() {
  const queries = [Q.where('status', BOOK_STATUSES.READ), Q.where('date', Q.gte(getStartOfYear().getTime()))];
  return database.collections.get<Book>('books').query(Q.and(...queries), Q.experimentalSortBy('date', Q.desc));
}

export function readBooksQuery() {
  return database.collections
    .get<Book>('books')
    .query(Q.where('status', BOOK_STATUSES.READ), Q.experimentalSortBy('date', Q.desc));
}

export function lastReadDateObserver() {
  return database.collections
    .get<Book>('books')
    .query(Q.where('status', BOOK_STATUSES.READ), Q.experimentalSortBy('date', Q.desc), Q.experimentalTake(1))
    .observeWithColumns(['date'])
    .pipe(map(rows => rows[0]?.date));
}

export function allListsObserver() {
  return database.collections.get<List>('lists').query().observeWithColumns(['name']);
}

export function listBooksQuery(listId: string) {
  return database.collections
    .get<Book>('books')
    .query(Q.where('status', BOOK_STATUSES.WISH), Q.on('list_books', 'list_id', listId), getDefaultSort());
}
