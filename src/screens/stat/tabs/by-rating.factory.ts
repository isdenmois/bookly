import _ from 'lodash';
import { byYear, IRow, FactoryProps } from './shared';

export interface RatingRow extends IRow {
  rating: number | string;
  count: number;
}

export function ByRatingFactory({ books, year }: FactoryProps): RatingRow[] {
  const result: RatingRow[] = _.times(10, i => ({ id: 10 - i, rating: 10 - i, count: 0 }));

  if (year) {
    books = books.filter(byYear(year));
  }

  let totalCount = 0;

  books.forEach(book => {
    result[10 - book.rating].count++;
    totalCount++;
  });

  result.push({
    id: 'total',
    rating: 'Итого',
    count: totalCount,
  });

  return result;
}
