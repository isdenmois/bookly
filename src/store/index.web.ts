import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

import { schema } from './schema';
import Book from './book';
import Author from './author';
import BookAuthor from './book-author';

const adapter = new LokiJSAdapter({ dbName: 'books', schema });

export const database = new Database({
  adapter,
  actionsEnabled: true,
  modelClasses: [Book, Author, BookAuthor],
});
