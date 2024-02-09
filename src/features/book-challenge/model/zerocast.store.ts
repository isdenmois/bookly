import { computed } from 'nanostores';

import { $lastReadDate, $readBooksCountByChallenge } from 'entities/book';
import { $challengeCount } from 'entities/settings';

import { t } from 'services/i18n';
import { dayOfYear, daysAmount } from 'utils/date';

import { formatDate } from '../lib';
import { getSpeed } from 'features/book-challenge/model/speed';

export const $zerocastMessage = computed(
  [$readBooksCountByChallenge, $challengeCount, $lastReadDate],
  getZerocastMessage,
);

export function getZerocastMessage(readCount: number, totalBooks: number, lastRead: Date): string {
  const total = daysAmount();
  const today = dayOfYear();
  const last = dayOfYear(lastRead);
  const remainDays = total - last;
  const getForecast = d => ((last + d) / total) * totalBooks;
  let speed = getSpeed(remainDays, totalBooks - readCount);

  if (speed < 3.5 || readCount >= Math.floor(getForecast(0))) return null;

  if (speed > 10) {
    speed = speed / 2;
  } else if (speed > 6) {
    speed = speed - 2;
  } else if (speed > 4.1) {
    speed = speed - 1;
  } else {
    speed = 3;
  }

  const top = speed * (total * readCount - last * totalBooks);
  const bottom = speed * totalBooks - total;
  const add = top / bottom;
  let zero = add + last + 1;
  let due = last + speed;

  while (today > due) {
    due += speed;
    zero += speed;
  }

  const dueDate = new Date();
  const zeroDate = new Date();

  zeroDate.setMonth(0, zero);
  dueDate.setMonth(0, due);
  speed = Math.round(speed * 10) / 10;

  return t('home.challenge.zerocast', {
    date: formatDate(dueDate),
    rate: speed,
    zero: formatDate(zeroDate),
    postProcess: 'rp',
  });
}
