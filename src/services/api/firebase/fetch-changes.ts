import _ from 'lodash';
export const url = '/:userId';

export function mapParams(sync) {
  return {
    query: { sync },
  };
}

export const mapBody = {
  authors: 'authors',
  books: parseBooks,
  book_authors: parseBookAuthors,
};

function parseBooks(changes) {
  changes.books.created = _.map(changes.books.created, bookParse);
  changes.books.updated = _.map(changes.books.updated, bookParse);

  return changes.books;
}

function parseBookAuthors(changes) {
  changes.book_authors.created = _.map(changes.book_authors.created, bookAuthorParse);

  return changes.book_authors;
}

function bookAuthorParse(bookAuthor) {
  const [book_id, author_id] = bookAuthor.id.split('_');

  return { ...bookAuthor, author_id, book_id };
}

function bookParse(book) {
  book.search = book.search ? `${book.title};${book.search}` : book.title;
  book.thumbnail = book.thumbnail && book.thumbnail.toString();
  return book;
}
