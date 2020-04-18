import _ from 'lodash';
import { Subject } from 'rxjs';
import { Database } from '@nozbe/watermelondb';
import { patchMethod } from 'utils/patch-method';
import { adapter } from './adapter';
import Book from './book';
import Author from './author';
import BookAuthor from './book-author';
import Review from './review';

export const database = new Database({
  adapter,
  actionsEnabled: true,
  modelClasses: [Book, Author, BookAuthor, Review] as any,
});

const changes = new Subject();

const isSyncStatusUpdated = model => model.syncStatus && model.syncStatus !== 'synced';

patchMethod(database, 'batch', function () {
  if (arguments.length && _.some(arguments, isSyncStatusUpdated)) {
    changes.next();
  }
});

export const onChanges = changes.asObservable();
