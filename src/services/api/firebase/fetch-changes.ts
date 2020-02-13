import _ from 'lodash';
import { api } from '../base/api';

const response = {
  authors: 'authors',
  books: parseBooks,
  book_authors: parseBookAuthors,
  reviews: parseReviews,
};

export default api
  .get<number>('/sync/:userId')
  .query(sync => ({ sync }))
  .response(response);

function parseBooks(changes) {
  changes.books.created = _.map(changes.books.created, bookParse);
  changes.books.updated = _.map(changes.books.updated, bookParse);

  return changes.books;
}

function parseBookAuthors(changes) {
  changes.book_authors.created = _.map(changes.book_authors.created, bookAuthorParse);

  return changes.book_authors;
}

function parseReviews(changes) {
  changes.reviews.created = _.map(changes.reviews.created, reviewParse);
  changes.reviews.updated = _.map(changes.reviews.updated, reviewParse);

  return changes.reviews;
}

function bookAuthorParse(bookAuthor) {
  const [book_id, author_id] = bookAuthor.id
    .replace(/l_/gi, 'l-')
    .split('_')
    .map(i => i.replace('l-', 'l_'));

  return { ...bookAuthor, author_id, book_id };
}

function bookParse(book) {
  book.search = book.search ? `${book.title};${book.search}` : book.title;
  book.thumbnail = book.thumbnail?.toString();
  return book;
}

function reviewParse(review) {
  [review.book_id] = review.id.split('_');

  return review;
}
