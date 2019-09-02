import _ from 'lodash';
import { Subject } from 'rxjs';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { patchMethod } from 'utils/patch-method';

import { migrations } from './migrations';
import { schema } from './schema';
import Book from './book';
import Author from './author';
import BookAuthor from './book-author';
import Review from './review';

const adapter = new SQLiteAdapter({ dbName: 'books', schema, migrations });

export const database = new Database({
  adapter,
  actionsEnabled: true,
  modelClasses: [Book, Author, BookAuthor, Review] as any,
});

const changes = new Subject();

const isSyncStatusUpdated = model => model.syncStatus && model.syncStatus !== 'synced';

patchMethod(database, 'batch', function() {
  if (arguments.length && _.some(arguments, isSyncStatusUpdated)) {
    changes.next();
  }
});

export const onChanges = changes.asObservable();
