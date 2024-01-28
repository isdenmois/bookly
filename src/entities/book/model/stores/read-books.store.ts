import { computed } from 'nanostores';
import { fromRx } from 'shared/lib';
import Book from 'store/book';
import { readBooksThisYearQuery } from '../queries';
import { $challengeType, ChallengeType } from 'entities/settings';

export const $readBooksThisYear = fromRx(
  () => readBooksThisYearQuery().observeWithColumns(['date', 'audio', 'paper', 'without_translation']),
  [],
);

export const $readBookCountThisYear = computed($readBooksThisYear, books => books.length);

const getBooksByChallenge = (books: Book[], type: ChallengeType) => {
  switch (type) {
    case 'totalBooks':
      return books;
    case 'challengeAudio':
      return books.filter(book => book.audio);
    case 'challengePaper':
      return books.filter(book => book.paper);
    case 'challengeWithoutTranslation':
      return books.filter(book => book.withoutTranslation);
  }

  return [];
};

export const $readBooksByChallenge = computed([$readBooksThisYear, $challengeType], (books, type) => {
  return getBooksByChallenge(books, type);
});

export const $readBooksCountByChallenge = computed($readBooksByChallenge, books => {
  return books.length;
});

export const $lastReadBook = computed($readBooksByChallenge, books => (books.length ? books[books.length - 1] : null));

export const $lastReadDate = computed($lastReadBook, book => book?.date);

//#region $readByCount
export const $readByCount = computed($readBooksByChallenge, getReadCountByMonth);

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
