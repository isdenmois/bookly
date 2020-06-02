import React, { useMemo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, ToastAndroid } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { observer } from 'mobx-react';
import { session } from 'services';
import { Counter } from 'components';
import { dayOfYear } from 'utils/date';
import { readBooksThisYearQuery, booksReadForecast } from '../home.queries';
const pluralize = require('pluralize-ru');

interface Props {
  readCount?: number;
}

function BookChallengeComponent({ readCount }: Props) {
  const totalBooks = session.totalBooks;
  const forecast = useMemo(() => booksReadForecast(readCount, totalBooks), [readCount, totalBooks]);
  const showProgress = useCallback(
    () => ToastAndroid.show(getProgressMessage(readCount, totalBooks), ToastAndroid.SHORT),
    [readCount, totalBooks],
  );

  return (
    <TouchableOpacity style={s.row} onPress={showProgress}>
      <Counter label='Прочитано' value={readCount} />
      <Counter label='Запланировано' value={totalBooks} testID='PlannedBooksCount' />
      <Counter label='Опережение' value={forecast} />
    </TouchableOpacity>
  );
}

function getProgressMessage(readCount, totalBooks): string {
  if (readCount >= totalBooks) {
    return 'Вы завершили книжный вызов!';
  }

  const days = 365 - dayOfYear();
  const toRead = totalBooks - readCount;
  const dayCount = Math.floor(days / toRead);
  const bookCount = (toRead / days) * 7;

  if (bookCount >= 2) {
    const books = pluralize(Math.round(bookCount * 10) / 10, '', '%d книге', '%d книги', '%d книг');
    return `Читайте по ${books} в неделю, чтобы успеть выполнить вызов`;
  }

  const count = pluralize(dayCount, '', 'каждый %d день', 'каждые %d дня', 'каждые %d дней');
  return `Читайте по книге ${count}, чтобы успеть выполнить вызов`;
}

export const BookChallenge = withObservables(null, () => ({
  readCount: readBooksThisYearQuery().observeCount(),
}))(observer(BookChallengeComponent));

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 20,
  } as ViewStyle,
});
