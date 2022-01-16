import { Q } from '@nozbe/watermelondb';

import { database } from 'store';
import Book from 'store/book';
import { BOOK_STATUSES } from 'types/book-statuses.enum';

export const currentBooksQuery = () => {
  return database.collections
    .get<Book>('books')
    .query(Q.where('status', BOOK_STATUSES.NOW), Q.sortBy('updated_at', Q.asc));
};
