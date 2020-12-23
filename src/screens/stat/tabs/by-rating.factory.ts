import _ from 'lodash';
import { t } from 'services';
import { IRow, StatTab, TabTransition, notTotal, openRead, StatBook, withReads } from './shared';

export interface RatingRow extends IRow {
  rating: number | string;
}

function ByRatingFactory(books: StatBook[]): RatingRow[] {
  const result: RatingRow[] = _.times(10, i => ({ id: 10 - i, rating: 10 - i, count: 0, items: [] }));

  let totalCount = 0;

  books.forEach(book => {
    result[10 - book.rating].count++;
    result[10 - book.rating].items.push(book);
    totalCount++;
  });

  result.push({
    id: 'total',
    key: 'total',
    rating: t('total'),
    count: totalCount,
  });

  return result;
}

export const transition: TabTransition = {
  enabled: notTotal,
  go(row, year) {
    const filters: any = { rating: { from: row.id, to: row.id } };

    openRead(withReads(row, filters), year);
  },
};

export const ByRating: StatTab = {
  header: ['stat.mark', 'stat.books'],
  columns: ['rating', 'count'],
  factory: ByRatingFactory,
  flexes: [1, 2],
};
