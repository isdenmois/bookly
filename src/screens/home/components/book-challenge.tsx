import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { observer } from 'mobx-react';
import { Database } from '@nozbe/watermelondb';
import { Counter } from 'components';
import { readBooksThisYearQuery, booksReadForecast } from '../home.queries';
import { inject, Session } from 'services';

interface Props {
  database: Database;
  readCount?: number;
}

function BookChallengeComponent({ readCount }: Props) {
  const session = inject(Session);
  const totalBooks = session.totalBooks;
  const forecast = useMemo(() => booksReadForecast(readCount, totalBooks), [readCount, totalBooks]);

  return (
    <View style={s.row}>
      <Counter label='Прочитано' value={readCount} />
      <Counter label='Запланировано' value={totalBooks} />
      <Counter label='Опережение' value={forecast} />
    </View>
  );
}

export const BookChallenge = withObservables(null, ({ database }: Props) => ({
  readCount: readBooksThisYearQuery(database).observeCount(),
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
