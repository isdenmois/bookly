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
import { IS_E2E } from 'services/config';

export const database = new Database({
  adapter,
  modelClasses: [Book, Author, BookAuthor, Review, List, ListBook] as any,
});

const isSyncStatusUpdated = model => model.syncStatus && model.syncStatus !== 'synced';

const changes = new Subject();

let timeout: any = null;
const notify = () => {
  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    timeout = null;

    changes.next(true);
  });
};

patchMethod(database, 'batch', function () {
  if (_.flatten(arguments).some(isSyncStatusUpdated)) {
    notify();
  }
});

export const onChanges = IS_E2E ? changes : changes.asObservable().pipe(debounceTime(1000));
