import _ from 'lodash';
import { api } from '../base/api';

type PushChanges = (sync: number, changes: any) => Promise<void>;

export default api
  .post<PushChanges>('/sync/:userId')
  .contentType('application/json')
  .query(sync => ({ sync: sync - 1 }))
  .body((sync, body) => preparePushChanges(body));

function preparePushChanges(changes) {
  return {
    authors: changes.authors,
    books: {
      created: _.map(changes.books.created, bookSerialize),
      updated: _.map(changes.books.updated, bookSerialize),
      deleted: changes.books.deleted,
    },
    book_authors: {
      created: _.map(changes.book_authors.created, ba => _.omit(ba, ['author_id', 'book_id'])),
      updated: changes.book_authors.updated,
      deleted: changes.book_authors.deleted,
    },
    reviews: {
      created: _.map(changes.reviews.created, reviewSerialize),
      updated: _.map(changes.reviews.updated, reviewSerialize),
      deleted: changes.reviews.deleted,
    },
  };
}

function bookSerialize(book) {
  return _.omitBy(
    {
      ...book,
      paper: book.paper || null,
      audio: book.audio || null,
      withoutTranslation: book.withoutTranslation || null,
      leave: book.leave || null,
      thumbnail: +book.thumbnail || book.thumbnail,
      search: book.search
        ?.split(';')
        .filter(s => s !== book.title)
        .join(';'),
    },
    isEmpty,
  );
}

function reviewSerialize(review) {
  return _.omitBy(_.pick(review, ['id', 'date', 'body']), isEmpty);
}

function isEmpty(value) {
  return value === null || value === undefined || value === '';
}
