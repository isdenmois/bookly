import React, { useMemo, useState } from 'react';
import { useObservable } from 'utils/use-observable';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { Text, View, StyleSheet, ViewStyle, FlatList } from 'react-native';
import { HeaderRow } from './components/header-row';
import { ScreenHeader, Screen } from 'components';
import { Row } from './components/row';
import { session, t } from 'services';
import { Q } from '@nozbe/watermelondb';
import { database } from 'store';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { StatGroups } from './components/stat-groups';
import { YearSelection } from './components/year-selection';
import { ByMonth } from './tabs/by-month.factory';
import { ByRating } from './tabs/by-rating.factory';
import { ByYear } from './tabs/by-year.factory';
import { ByAuthor } from './tabs/by-author.factory';
import { ByType } from './tabs/by-type.factory';
import { CURRENT_YEAR, mapBooks, StatBook, StatTab, TABS, byYear } from './tabs/shared';

const STAT_GROUPS: Record<string, StatTab> = {
  MONTH: ByMonth,
  AUTHOR: ByAuthor,
  RATING: ByRating,
  YEAR: ByYear,
  TYPE: ByType,
};

export function StatScreen() {
  const [type, setType] = useState(TABS.MONTH);
  const [year, setYear] = useState(CURRENT_YEAR);
  const { rows, minYear } = useRows(type, year);

  const group = STAT_GROUPS[type];

  return (
    <Screen>
      <ScreenHeader title='nav.stat' />

      <View>
        <StatGroups type={type} onChange={setType} />
        {!group.allYears && <YearSelection year={year} minYear={minYear} onChange={setYear} />}
        <HeaderRow columns={group.header} flexes={group.flexes} />
      </View>

      <FlatList
        style={s.body}
        contentContainerStyle={s.bodyContainer}
        data={rows}
        keyExtractor={i => String(i.id)}
        renderItem={({ item }) => (
          <Row row={item} columns={group.columns} flexes={group.flexes} type={type} year={year} />
        )}
        ListEmptyComponent={<Text>{t('empty')}</Text>}
      />
    </Screen>
  );
}

function BooksList(): Observable<{ books: StatBook[]; minYear: number }> {
  const min = new Date(session.minYear, 0, 1, 0, 0, 0).getTime();

  return database.collections
    .get('books')
    .query(Q.where('status', BOOK_STATUSES.READ), Q.where('date', Q.gte(min)))
    .observeWithColumns(['date', 'rating', 'paper', 'audio', 'withoutTranslation', 'leave'])
    .pipe(map(mapBooks) as any);
}

function useRows(type, year) {
  const { books, minYear } = useObservable(BooksList, { books: [], minYear: CURRENT_YEAR }, []);

  const rows = useMemo(() => {
    const group = STAT_GROUPS[type];
    let items = books;

    if (!group.allYears && year) {
      items = books.filter(byYear(year));
    }

    return group.factory(items, year);
  }, [books, type, year]);

  return { rows, minYear };
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  spinner: {
    marginTop: 40,
  } as ViewStyle,
  body: {
    marginTop: 15,
  } as ViewStyle,
  bodyContainer: {
    paddingHorizontal: 15,
  } as ViewStyle,
});
