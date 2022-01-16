import { Q } from '@nozbe/watermelondb';

import { database } from 'store';
import Book from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { getStartOfYear } from 'utils/date';

export const allReadBooksQuery = () => {
  return database.collections.get<Book>('books').query(Q.where('status', BOOK_STATUSES.READ), Q.sortBy('date', Q.desc));
};

export const allReadBooksLimitedQuery = (limit: number) => {
  return allReadBooksQuery().extend(Q.take(limit)).observe();
};

export const allReadBooksTotalCountQuery = () => {
  return allReadBooksQuery().observeCount();
};

export const readBooksThisYearQuery = () => {
  const queries = [Q.where('status', BOOK_STATUSES.READ), Q.where('date', Q.gte(getStartOfYear().getTime()))];

  return database.collections.get<Book>('books').query(Q.and(...queries), Q.sortBy('date', Q.desc));
};

export const lastReadBookQuery = () => {
  return database.collections
    .get<Book>('books')
    .query(Q.where('status', BOOK_STATUSES.READ), Q.sortBy('date', Q.desc), Q.take(1));
};
