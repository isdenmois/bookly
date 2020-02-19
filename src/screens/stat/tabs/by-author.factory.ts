import { round, byYear, IRow, FactoryProps, StatTab, TabTransition, openRead } from './shared';
import _ from 'lodash';
import { inject } from 'services';
import { Database, Q } from '@nozbe/watermelondb';
import { ToastAndroid } from 'react-native';

export interface AuthorRow extends IRow {
  rating: number;
}

function ByAuthorFactory({ books, year }: FactoryProps): AuthorRow[] {
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

  return _.orderBy(result, ['count', 'id'], ['desc', 'asc']);
}

export const transition: TabTransition = {
  enabled: () => true,
  async go(row, year) {
    const filters: any = {};
    const database = inject(Database);
    const authors: any[] = await database.collections
      .get('authors')
      .query(Q.where('name', Q.eq(row.id)))
      .fetch();

    if (!authors?.[0].id) {
      return ToastAndroid.show('Не удалось открыть автора', ToastAndroid.SHORT);
    }

    if (year) {
      filters.year = year;
    } else {
      filters.minYear = true;
    }

    filters.author = _.pick(authors[0], ['id', 'name']);

    openRead(filters);
  },
};

export const ByAuthor: StatTab = {
  header: ['Автор', 'Книг', 'Оценка'],
  columns: ['id', 'count', 'rating'],
  flexes: [2, 1, 1],
  factory: ByAuthorFactory,
};
