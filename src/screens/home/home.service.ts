import { Database, Q } from '@nozbe/watermelondb';
import { SyncService, inject } from 'services';
import { BOOK_STATUSES } from 'types/book-statuses.enum';

const ONE_DAY = 1000 * 60 * 60 * 24;

export class HomeService {
  syncService = inject(SyncService);
  database = inject(Database);

  async updateBook(book, title) {
    await this.database.action(() =>
      book.update(() => {
        book.title = title;
      }),
    );

    return this.syncService.sync();
  }

  async removeBook(book) {
    await this.database.action(() => book.markAsDeleted());

    return this.syncService.sync();
  }
}

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

function getStartOfYear(date = new Date()) {
  return new Date(date.getFullYear(), 0, 1, 0);
}

function dayOfYear(): number {
  const now = new Date();
  const start = getStartOfYear(now);
  const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;

  return Math.floor(diff / ONE_DAY);
}
