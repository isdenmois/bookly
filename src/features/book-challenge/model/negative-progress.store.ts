import { computed } from 'nanostores';

import { $lastReadDate, $readBookCountThisYear } from 'entities/book';
import { $totalBooks } from 'entities/settings';

import { t } from 'services/i18n';
import { dayOfYear, daysAmount, getCurrentYear, getStartOfYear } from 'utils/date';

import { formatDate } from '../lib';

export const $negativeProgressDate = computed(
  [$readBookCountThisYear, $totalBooks, $lastReadDate],
  getNegativeProgressDate,
);
export const $negativeProgressMessage = computed(
  [$readBookCountThisYear, $totalBooks, $lastReadDate],
  getNegativeProgress,
);

export function getNegativeProgressDate(readCount: number, totalBooks: number, lastRead: Date): string {
  if (readCount === 0 || !lastRead) {
    return null;
  }

  const today = dayOfYear();
  const amount = daysAmount();
  const needToRead = Math.floor((today / amount) * totalBooks);

  if (readCount >= needToRead) return null;

  const remainDays = amount - today;
  const toRead = totalBooks - readCount;
  let speed = remainDays / toRead;

  let last = dayOfYear(lastRead) + speed;

  while (today > last) {
    last += speed;
    speed = (amount - last) / toRead;
  }

  lastRead = new Date(lastRead);
  lastRead.setMonth(0, last);

  return formatDate(lastRead);
}

export function getNegativeProgress(readCount: number, totalBooks: number, lastRead: Date): string {
  if (!lastRead) {
    return null;
  }

  const today = dayOfYear();
  const amount = daysAmount();
  const needToRead = Math.floor((today / amount) * totalBooks);

  if (lastRead.getFullYear() !== getCurrentYear()) {
    lastRead = getStartOfYear();
  }

  if (readCount >= needToRead) return null;

  const remainDays = amount - today;
  const toRead = totalBooks - readCount;
  let speed = remainDays / toRead;

  let last = dayOfYear(lastRead) + speed;

  while (today > last) {
    last += speed;
    speed = (amount - last) / toRead;
  }

  lastRead = new Date(lastRead);
  lastRead.setMonth(0, last);

  const rate = Math.round(speed * 10) / 10;

  return t('home.challenge.progress-rate', { date: formatDate(lastRead), rate, postProcess: 'rp' });
}