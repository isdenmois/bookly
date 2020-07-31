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

  const speed = (daysAmount() - dayOfYear()) / (totalBooks - readCount);

  if (speed < 3) {
    return t('home.challenge.cantdoit');
  }

  return [
    getNegativeProgress(readCount, totalBooks, lastRead),
    getProgressMessage(readCount, totalBooks),
    getZerocastMessage(readCount, totalBooks),
    getForecastMessage(readCount, totalBooks),
  ]
    .filter(_.identity)
    .join('\n\n');
}

export function getProgressMessage(readCount: number, totalBooks: number): string {
  const today = dayOfYear();
  const amount = daysAmount();
  const getForecast = d => Math.round(((today + d) / amount) * totalBooks);
  const needToRead = getForecast(0);
  const date = new Date();

  if (readCount < needToRead) {
    return null;
  }

  let add = 0;

  while (getForecast(add) <= readCount && add + today < amount) {
    add++;
  }

  const dueDate = today + add - 1;
  date.setMonth(0, dueDate);

  return t('home.challenge.progress', {
    date: formatDate(date),
  });
}

export function getNegativeProgress(readCount: number, totalBooks: number, lastRead: Date) {
  const today = dayOfYear();
  const amount = daysAmount();
  const getForecast = d => Math.round(((today + d) / amount) * totalBooks);
  const needToRead = getForecast(0);

  if (readCount >= needToRead) return null;

  const remainDays = amount - today;
  const toRead = totalBooks - readCount;
  const dayCount = Math.floor(remainDays / toRead);

  lastRead = new Date(lastRead);
  lastRead.setDate(lastRead.getDate() + dayCount);

  while (dayOfYear(lastRead) < today) {
    lastRead.setDate(lastRead.getDate() + dayCount);
  }

  const rate = Math.round((remainDays / toRead) * 10) / 10;

  return t('home.challenge.progress-rate', { date: formatDate(lastRead), rate, postProcess: 'rp' });
}

export function getZerocastMessage(readCount: number, totalBooks: number) {
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

  let dueDate = new Date();
  let zeroDate = new Date();

  let add = speed;
  let j = readCount + 1;
  while (getForecast(add) > j) {
    j++;
    add += speed;

    if (today + add > total) {
      return null;
    }
  }

  zeroDate.setMonth(0, today + add);
  dueDate.setMonth(0, today + speed);
  speed = Math.round(speed * 10) / 10;

  return t('home.challenge.zerocast', {
    date: formatDate(dueDate),
    rate: speed,
    zero: formatDate(zeroDate),
    postProcess: 'rp',
  });
}

export function getForecastMessage(readCount: number, totalBooks: number): string {
  const date = new Date();
  const today = dayOfYear();
  const total = daysAmount();
  let willRead = Math.round((total / today) * readCount);
  const getForecast = d => Math.round(((today + d) / total) * willRead);
  let speed = today / readCount;
  let add = 0;

  // if dueDate is today
  if (getForecast(1) > readCount) {
    willRead--;
  }

  if (willRead === totalBooks) {
    return null;
  }

  while (getForecast(add) <= readCount && add + today < total) {
    add++;
  }

  const dueDate = today + add - 1;

  date.setMonth(0, dueDate);
  speed = Math.round(speed * 10) / 10;

  return t('home.challenge.forecast', { date: formatDate(date), rate: speed, count: willRead, postProcess: 'rp' });
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
