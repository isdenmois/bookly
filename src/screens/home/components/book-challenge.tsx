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
      <Counter label={t('home.challenge.anticipate')} value={totalBooks} testID='plannedBooksCount' />
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
    getZerocastMessage(readCount, totalBooks, lastRead),
    getForecastMessage(readCount, totalBooks, lastRead),
  ]
    .filter(_.identity)
    .join('\n\n');
}

export function getProgressMessage(readCount: number, totalBooks: number): string {
  const today = dayOfYear();
  const amount = daysAmount();
  const needToRead = Math.floor((today / amount) * totalBooks);

  if (readCount < needToRead) {
    return null;
  }

  const dueDate = ((readCount + 1) * amount) / totalBooks;
  const date = new Date();

  date.setMonth(0, dueDate);

  return t('home.challenge.progress', {
    date: formatDate(date),
  });
}

export function getNegativeProgress(readCount: number, totalBooks: number, lastRead: Date) {
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

  const rate = Math.round(speed * 10) / 10;

  return t('home.challenge.progress-rate', { date: formatDate(lastRead), rate, postProcess: 'rp' });
}

export function getZerocastMessage(readCount: number, totalBooks: number, lastRead: Date) {
  const total = daysAmount();
  const today = dayOfYear();
  const last = dayOfYear(lastRead);
  const remainDays = total - last;
  const getForecast = d => ((last + d) / total) * totalBooks;
  let speed = remainDays / (totalBooks - readCount);

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

export function getForecastMessage(readCount: number, totalBooks: number, lastRead: Date): string {
  const date = new Date();
  const today = dayOfYear();
  const total = daysAmount();
  const last = dayOfYear(lastRead);
  let willRead = Math.round((total / last) * readCount);
  let speed = last / readCount;

  let dueDate = ((readCount + 1) * total) / willRead;

  while (today > dueDate) {
    willRead--;
    dueDate = ((readCount + 1) * total) / willRead;
    speed = dueDate / readCount;
  }

  date.setMonth(0, dueDate);
  speed = Math.round(speed * 10) / 10;

  if (willRead === totalBooks) {
    return null;
  }

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
