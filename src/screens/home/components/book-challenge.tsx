import _ from 'lodash';
import React, { useMemo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, ToastAndroid } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { observer } from 'mobx-react';
import { session } from 'services';
import { t } from 'services/i18n';
import { Counter } from 'components';
import { dayOfYear, format, daysAmount } from 'utils/date';
import { readBooksThisYearQuery, booksReadForecast, lastReadDateObserver } from '../home.queries';

const DATE_FORMAT = 'DD.MM';
const formatDate = date => format(date, DATE_FORMAT);

interface Props {
  readCount?: number;
  lastReadDate?: Date;
}

function BookChallengeComponent({ readCount, lastReadDate }: Props) {
  const totalBooks = session.totalBooks;
  const forecast = useMemo(() => booksReadForecast(readCount, totalBooks), [readCount, totalBooks]);
  const showProgress = useCallback(
    () => ToastAndroid.show(getChallengeMessage(readCount, totalBooks, new Date(lastReadDate)), ToastAndroid.LONG),
    [readCount, totalBooks, lastReadDate],
  );

  return (
    <TouchableOpacity style={s.row} onPress={showProgress}>
      <Counter label={t('home.challenge.completed')} value={readCount} />
      <Counter label={t('home.challenge.anticipate')} value={totalBooks} testID='PlannedBooksCount' />
      <Counter label={t('home.challenge.ahead')} value={forecast} />
    </TouchableOpacity>
  );
}

export function getChallengeMessage(readCount: number, totalBooks: number, lastRead: Date): string {
  if (readCount >= totalBooks) {
    return t('home.challenge.youve-completed');
  }

  return [
    getProgressMessage(readCount, totalBooks, new Date(lastRead)),
    getZerocastMessage(readCount, totalBooks, new Date(lastRead)),
    getForecastMessage(readCount, new Date(lastRead)),
  ]
    .filter(_.identity)
    .join('\n\n');
}

export function getProgressMessage(readCount: number, totalBooks: number, lastRead: Date): string {
  const today = dayOfYear();
  const amount = daysAmount();
  const remainDays = daysAmount() - dayOfYear();
  const needToRead = Math.round((today / amount) * totalBooks);

  if (readCount > needToRead) {
    const dueDate = (readCount / totalBooks) * amount;
    lastRead.setMonth(0, dueDate);

    return t('home.challenge.progress', { date: formatDate(lastRead) });
  }

  const toRead = totalBooks - readCount;
  const dayCount = Math.floor(remainDays / toRead);

  if (dayCount < 3) {
    return t('home.challenge.cantdoit');
  }

  lastRead.setDate(lastRead.getDate() + dayCount);

  while (dayOfYear(lastRead) < today) {
    lastRead.setDate(lastRead.getDate() + dayCount);
  }

  const rate = Math.round((remainDays / toRead) * 10) / 10;

  return t('home.challenge.progress-rate', { date: formatDate(lastRead), rate, postProcess: 'rp' });
}

export function getZerocastMessage(readCount: number, totalBooks: number, lastRead: Date) {
  const total = daysAmount();
  const today = dayOfYear();
  const remainDays = total - today;
  const getForecast = d => ((today + d) / total) * totalBooks;
  let speed = remainDays / (totalBooks - readCount);

  if (speed < 3.5 || readCount >= getForecast(0)) return null;

  if (speed > 10) {
    speed = speed / 2;
  } else if (speed > 6) {
    speed = speed - 2;
  } else if (speed > 4.1) {
    speed = speed - 1;
  } else {
    speed = 3;
  }

  let dueDate: Date | string = new Date();

  let add = speed;
  let j = readCount + 1;
  while (getForecast(add) > j) {
    j++;
    add += speed;

    if (add + today >= total) {
      return null;
    }
  }

  lastRead.setDate(lastRead.getDate() + speed);
  dueDate.setDate(dueDate.getDate() + add);

  while (dayOfYear(lastRead) < today) {
    lastRead.setDate(lastRead.getDate() + speed);
  }

  speed = Math.round(speed * 10) / 10;

  return t('home.challenge.zerocast', {
    date: formatDate(lastRead),
    rate: speed,
    due: formatDate(dueDate),
    postProcess: 'rp',
  });
}

export function getForecastMessage(readCount: number, lastRead: Date): string {
  const today = dayOfYear();
  const remainDays = daysAmount() - today;
  let speed = today / readCount;
  const dayCount = Math.floor(speed);
  const willRead = readCount + Math.round(remainDays / speed);

  lastRead.setDate(lastRead.getDate() + dayCount);

  while (dayOfYear(lastRead) < today) {
    lastRead.setDate(lastRead.getDate() + dayCount);
  }

  speed = Math.round(speed * 10) / 10;

  return t('home.challenge.forecast', { date: formatDate(lastRead), rate: speed, count: willRead, postProcess: 'rp' });
}

export const BookChallenge = withObservables(null, () => ({
  readCount: readBooksThisYearQuery().observeCount(),
  lastReadDate: lastReadDateObserver(),
}))(observer(BookChallengeComponent));

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 20,
  } as ViewStyle,
});
