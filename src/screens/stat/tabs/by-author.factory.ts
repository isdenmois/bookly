import { round, IRow, StatTab, TabTransition, openRead, StatBook, withReads } from './shared';
import _ from 'lodash';
import { Q } from '@nozbe/watermelondb';
import { ToastAndroid } from 'react-native';
import { database } from 'store';

export interface AuthorRow extends IRow {
  count: number;
  rating: number;
}

function ByAuthorFactory(books: StatBook[]): AuthorRow[] {
  const authors = new Map<string, AuthorRow>();

  books.forEach(book => {
    book.authors.forEach(author => {
      if (authors.has(author)) {
        const row = authors.get(author);
        ++row.count;
        row.rating += book.rating;
        row.items.push(book);
      } else {
        authors.set(author, { id: author, count: 1, rating: book.rating, items: [book] });
      }
    });
  });

  const result = Array.from(authors.values());

  result.forEach(row => {
    row.rating = round(row.rating / row.count);
    row.items = _.uniqBy(row.items, 'id');
  });

  return _.orderBy(result, ['count', 'id'], ['desc', 'asc']);
}

export const transition: TabTransition = {
  enabled: () => true,
  async go(row, year) {
    const filters: any = {};
    const authors: any[] = await database.collections
      .get('authors')
      .query(Q.where('name', Q.eq(row.id)))
      .fetch();

    if (!authors?.[0].id) {
      return ToastAndroid.show('Не удалось открыть автора', ToastAndroid.SHORT);
    }

    filters.author = _.pick(authors[0], ['id', 'name']);

    openRead(withReads(row, filters), year);
  },
};

export const ByAuthor: StatTab = {
  header: ['author', 'stat.books', 'stat.mark'],
  columns: ['id', 'count', 'rating'],
  flexes: [2, 1, 1],
  factory: ByAuthorFactory,
};
