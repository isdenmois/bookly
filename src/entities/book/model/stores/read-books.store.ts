import { computed } from 'nanostores';
import { map } from 'rxjs';
import { fromRx } from 'shared/lib';
import Book from 'store/book';
import { readBooksThisYearQuery, lastReadBookQuery } from '../queries';

export const $readBooksThisYear = fromRx(() => readBooksThisYearQuery().observe(), []);

export const $readBookCountThisYear = computed($readBooksThisYear, books => books.length);

export const $lastReadBook = fromRx(
  () =>
    lastReadBookQuery()
      .observeWithColumns(['date'])
      .pipe(map(rows => rows[0])),
  null,
);

export const $lastReadDate = computed($lastReadBook, book => book?.date);

//#region $readByCount
export const $readByCount = computed($readBooksThisYear, getReadCountByMonth);

export function getReadCountByMonth(books: Book[]): Map<number, number> {
  const map = new Map<number, number>();

  books.forEach(book => {
    const month = book.date.getMonth();

    map.set(month, (map.get(month) ?? 0) + 1);
  });

  return map;
}
//#endregion

//#region $maxReadCount
export const $maxReadCount = computed($readByCount, getMaxReadCount);

export function getMaxReadCount(counts: Map<number, number>): number {
  return [...counts.values()].reduce((prev, count) => Math.max(prev, count), 1);
}
//#endregion
