import { computed } from 'nanostores';

import { $lastReadDate, $readBooksCountByChallenge } from 'entities/book';
import { $totalBooks } from 'entities/settings';

import { dayOfYear, daysAmount } from 'utils/date';
import { t } from 'services/i18n';

import { formatDate } from '../lib';
import { getSpeed } from 'features/book-challenge/model/speed';

export const $forecastMessage = computed([$readBooksCountByChallenge, $totalBooks, $lastReadDate], getForecastMessage);

export function getForecastMessage(readCount: number, totalBooks: number, lastRead: Date): string {
  if (readCount === 0 || !lastRead) {
    return null;
  }

  const date = new Date();
  const today = dayOfYear();
  const total = daysAmount();
  const last = dayOfYear(lastRead);
  let willRead = Math.round((total / last) * readCount);
  let speed = getSpeed(last, readCount);

  let dueDate = ((readCount + 1) * total) / willRead;

  while (today > dueDate) {
    willRead--;
    dueDate = ((readCount + 1) * total) / willRead;
    speed = getSpeed(dueDate, readCount);
  }

  date.setMonth(0, dueDate);
  speed = Math.round(speed * 10) / 10;

  if (willRead === totalBooks) {
    return null;
  }

  return t('home.challenge.forecast', { date: formatDate(date), rate: speed, count: willRead, postProcess: 'rp' });
}

export const $readingForecast = computed([$readBooksCountByChallenge, $totalBooks], getBooksReadForecast);

export function getBooksReadForecast(read: number, total: number): number {
  const yearProgress = dayOfYear() / daysAmount();
  const needToRead = Math.floor(yearProgress * total);

  return read - needToRead;
}
