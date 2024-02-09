import { computed } from 'nanostores';

import { $readBooksCountByChallenge } from 'entities/book';
import { $challengeCount } from 'entities/settings';

import { t } from 'services/i18n';
import { dayOfYear, daysAmount } from 'utils/date';

import { formatDate } from '../lib';

export const $progressDate = computed([$readBooksCountByChallenge, $challengeCount], getProgressDate);

export const $progressMessage = computed($progressDate, getProgressMessage);

export function getProgressDate(readCount: number, totalBooks: number): string {
  const today = dayOfYear();
  const amount = daysAmount();
  const needToRead = Math.floor((today / amount) * totalBooks);

  if (readCount < needToRead) {
    return null;
  }

  const dueDate = ((readCount + 1) * amount) / totalBooks;
  const date = new Date();

  date.setMonth(0, dueDate);

  return formatDate(date);
}

export function getProgressMessage(date: string): string {
  return date && t('home.challenge.advice', { date });
}
