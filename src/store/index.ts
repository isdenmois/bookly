import _ from 'lodash';
import { Subject } from 'rxjs';
import { Database } from '@nozbe/watermelondb';
import { patchMethod } from 'utils/patch-method';
import { debounceTime } from 'rxjs/operators';
import { adapter } from './adapter';
import Book from './book';
import Author from './author';
import BookAuthor from './book-author';
import Review from './review';
import List from './list';
import ListBook from './list-book';

export const database = new Database({
  adapter,
  actionsEnabled: true,
  modelClasses: [Book, Author, BookAuthor, Review, List, ListBook] as any,
});

const changes = new Subject();

const isSyncStatusUpdated = model => model.syncStatus && model.syncStatus !== 'synced';

patchMethod(database, 'batch', function () {
  if (_.flatten(arguments).some(isSyncStatusUpdated)) {
    changes.next();
  }
});

export const onChanges = changes.asObservable().pipe(debounceTime(1000));
