import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import Book from './book';
import Author from './author';
import BookAuthor from './book-author';

const adapter = new SQLiteAdapter({ dbName: 'books', schema });

export const database = new Database({
  adapter,
  actionsEnabled: true,
  modelClasses: [Book, Author, BookAuthor],
});
