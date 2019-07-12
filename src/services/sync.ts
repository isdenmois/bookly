import _ from 'lodash';
import { observable } from 'mobx';
import { synchronize } from '@nozbe/watermelondb/sync';
import { getLastPulledAt } from '@nozbe/watermelondb/sync/impl';
import { inject } from 'react-ioc';
import { Database } from '@nozbe/watermelondb';
import { Session } from './session';
import { FirebaseAPI } from './api';

export class SyncService {
  database = inject(this, Database);
  session = inject(this, Session);
  api = inject(this, FirebaseAPI);

  @observable lastPulledAt: number = 0;

  async sync() {
    if (!this.session.userId) {
      return null;
    }

    await synchronize({
      database: this.database,
      pullChanges: this.pullChanges,
      pushChanges: this.pushChanges,
    });

    this.lastPulledAt = await getLastPulledAt(this.database);
  }

  pullChanges = async ({ lastPulledAt }) => {
    const changes = await this.api.fetchChanges(lastPulledAt);

    const timestamp = Date.now();

    return { changes: preparePullChanges(changes), timestamp };
  };

  pushChanges = ({ lastPulledAt, changes }) =>
    hasChanges(changes) ? this.api.pushChanges(lastPulledAt, preparePushChanges(changes)) : Promise.resolve();
}

function preparePullChanges(changes) {
  changes.book_authors.created = _.map(changes.book_authors.created, bookAuthorParse);
  changes.books.created = _.map(changes.books.created, bookParse);
  changes.books.updated = _.map(changes.books.updated, bookParse);

  return changes;
}

function preparePushChanges(changes) {
  changes.book_authors.created = _.map(changes.book_authors.created, ba => _.omit(ba, ['author_id', 'book_id']));
  changes.books.created = _.map(changes.books.created, bookSerialize);
  changes.books.updated = _.map(changes.books.updated, bookSerialize);

  return changes;
}

function bookAuthorParse(bookAuthor) {
  const [book_id, author_id] = bookAuthor.id.split('_');

  return { ...bookAuthor, author_id, book_id };
}

function bookSerialize(book) {
  book.search =
    book.search &&
    book.search
      .split(';')
      .filter(s => s !== book.title)
      .join(';');

  if (!book.search) {
    delete book.search;
  }

  book.thumbnail = +book.thumbnail || book.thumbnail;

  return book;
}

function bookParse(book) {
  book.search = book.search ? `${book.title};${book.search}` : book.title;
  book.thumbnail = book.thumbnail && book.thumbnail.toString();
  return book;
}

function hasChanges(changes) {
  return _.some(changes, table => _.some(table, _.size));
}
