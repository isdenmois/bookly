import { Q } from '@nozbe/watermelondb';
import _ from 'lodash';
import { settings } from 'services';

import { database } from 'store';
import Book from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';

export const wishBooksQuery = (sort: Q.SortBy = getDefaultSort()) => {
  return database.collections.get<Book>('books').query(Q.where('status', BOOK_STATUSES.WISH), sort);
};

export const wishBooksLimitedQuery = (limit: number) => {
  return wishBooksQuery().extend(Q.take(limit)).observe();
};

export const wishBooksTotalCountQuery = () => {
  return wishBooksQuery().observeCount();
};

const INITIAL_SORT = { field: 'title', desc: false };
const getDefaultSort = () => {
  const sort = settings.defaultSort || INITIAL_SORT;
  const field = _.snakeCase(sort.field);

  return Q.sortBy(field, sort.desc ? Q.desc : Q.asc);
};
