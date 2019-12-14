import { round, byYear, IRow, FactoryProps } from './shared';
import _ from 'lodash';

export interface AuthorRow extends IRow {
  count: number;
  rating: number;
}

export function ByAuthorFactory({ books, year }: FactoryProps): AuthorRow[] {
  const authors = new Map<string, AuthorRow>();

  if (year) {
    books = books.filter(byYear(year));
  }

  books.forEach(book => {
    book.authors.forEach(author => {
      if (authors.has(author)) {
        const row = authors.get(author);
        ++row.count;
        row.rating += book.rating;
      } else {
        authors.set(author, { id: author, count: 1, rating: book.rating });
      }
    });
  });

  const result = Array.from(authors.values());

  result.forEach(row => {
    row.rating = round(row.rating / row.count);
  });

  return _.sortBy(result, 'count').reverse();
}
