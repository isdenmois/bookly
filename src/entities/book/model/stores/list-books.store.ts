import { createLimitedList, createLimitedListTemplate } from 'shared/lib';
import Book from 'store/book';
import {
  allReadBooksLimitedQuery,
  allReadBooksTotalCountQuery,
  listBooksLimitedQuery,
  listBooksTotalCountQuery,
  wishBooksLimitedQuery,
  wishBooksTotalCountQuery,
} from '../queries';

export interface ListBooks {
  id: string;
  books: Book[];
  totalCount: number;
}

const DEFAULT_LIMIT = 10;

export const $readBooksLimited = createLimitedList<Book>(
  () => allReadBooksLimitedQuery(DEFAULT_LIMIT),
  () => allReadBooksTotalCountQuery(),
);

export const $wishBooksLimited = createLimitedList(
  () => wishBooksLimitedQuery(DEFAULT_LIMIT),
  () => wishBooksTotalCountQuery(),
);

export const $listBooks = createLimitedListTemplate<Book>(
  listId => listBooksLimitedQuery(listId, DEFAULT_LIMIT),
  listId => listBooksTotalCountQuery(listId),
);
