import _ from 'lodash';

export const url = '/:userId';

export const method = 'POST';

export const contentType = 'application/json';

export function mapParams(sync, body) {
  return {
    query: { sync: sync - 1 },
    body: preparePushChanges(body),
  };
}

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
      updated: changes.books.updated,
      deleted: changes.books.deleted,
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
      thumbnail: +book.thumbnail || book.thumbnail,
      search:
        book.search &&
        book.search
          .split(';')
          .filter(s => s !== book.title)
          .join(';'),
    },
    isEmpty,
  );
}

function reviewSerialize(review) {
  return _.omitBy(_.pick(review, ['id', 'date', 'body']), isEmpty)
}

function isEmpty(value) {
  return value === null || value === undefined || value === '';
}
