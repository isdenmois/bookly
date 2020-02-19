import _ from 'lodash';
import { IRow, StatTab, TabTransition, notTotal, openRead, StatBook } from './shared';

export interface RatingRow extends IRow {
  rating: number | string;
}

function ByRatingFactory(books: StatBook[]): RatingRow[] {
  const result: RatingRow[] = _.times(10, i => ({ id: 10 - i, rating: 10 - i, count: 0 }));

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

export const transition: TabTransition = {
  enabled: notTotal,
  go(row, year) {
    const filters: any = {};

    filters.rating = { from: row.id, to: row.id };

    openRead(filters, year);
  },
};

export const ByRating: StatTab = {
  header: ['Оценка', 'Книг'],
  columns: ['rating', 'count'],
  factory: ByRatingFactory,
  flexes: [1, 2],
};
