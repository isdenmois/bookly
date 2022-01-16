import { Q } from '@nozbe/watermelondb';
import _ from 'lodash';

import { settings } from 'services';
import { database } from 'store';
import Book from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';

export function listBooksQuery(listId: string) {
  return database.collections
    .get<Book>('books')
    .query(Q.where('status', BOOK_STATUSES.WISH), Q.on('list_books', 'list_id', listId), getDefaultSort());
}

export function listBooksLimitedQuery(listId: string, limit: number) {
  return listBooksQuery(listId).extend(Q.take(limit)).observe();
}

export function listBooksTotalCountQuery(listId: string) {
  return listBooksQuery(listId).observeCount();
}

const INITIAL_SORT = { field: 'title', desc: false };
const getDefaultSort = () => {
  const sort = settings.defaultSort || INITIAL_SORT;
  const field = _.snakeCase(sort.field);

  return Q.sortBy(field, sort.desc ? Q.desc : Q.asc);
};
