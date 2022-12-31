import _ from 'lodash';
import { computed } from 'nanostores';

import { $lastReadDate, $readBookCountThisYear } from 'entities/book';
import { $totalBooks } from 'entities/settings';

import { t } from 'services/i18n';
import { dayOfYear, daysAmount } from 'utils/date';

import { getNegativeProgress } from './negative-progress.store';
import { getProgressDate, getProgressMessage } from './progress.store';
import { getZerocastMessage } from './zerocast.store';
import { getForecastMessage } from './forecast.store';
import { getSpeed } from './speed';

export const $challengeMessage = computed([$readBookCountThisYear, $totalBooks, $lastReadDate], getChallengeMessage);

export function getChallengeMessage(readCount: number, totalBooks: number, lastRead: Date): string {
  if (readCount >= totalBooks) {
    return t('home.challenge.youve-completed');
  }

  const speed = getSpeed(daysAmount() - dayOfYear(), totalBooks - readCount);

  if (speed < 3) {
    return t('home.challenge.cantdoit');
  }

  return [
    getNegativeProgress(readCount, totalBooks, lastRead),
    getProgressMessage(getProgressDate(readCount, totalBooks)),
    getZerocastMessage(readCount, totalBooks, lastRead),
    getForecastMessage(readCount, totalBooks, lastRead),
  ]
    .filter(_.identity)
    .join('\n\n');
}
