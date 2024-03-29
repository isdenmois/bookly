import React, { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import { Text, View, StyleSheet, ViewStyle, FlatList } from 'react-native';
import { HeaderRow } from './components/header-row';
import { Row } from './components/row';
import { t } from 'services';
import { StatGroups } from './components/stat-groups';
import { YearSelection } from './components/year-selection';
import { ByMonth } from './tabs/by-month.factory';
import { ByRating } from './tabs/by-rating.factory';
import { ByYear } from './tabs/by-year.factory';
import { ByAuthor } from './tabs/by-author.factory';
import { ByType } from './tabs/by-type.factory';
import { CURRENT_YEAR, StatBook, StatTab, TABS, byYear, Sort, IRow } from './tabs/shared';
import { $readBookCountThisYear } from 'entities/book';

const STAT_GROUPS: Record<string, StatTab> = {
  MONTH: ByMonth,
  AUTHOR: ByAuthor,
  RATING: ByRating,
  YEAR: ByYear,
  TYPE: ByType,
};

interface Props {
  books: StatBook[];
  minYear: number;
}

export function Stat({ books, minYear }: Props) {
  const { type, year, sort, setType, setYear, setSort } = useStatParams();
  let rows = useRows(books, minYear, type, year);
  rows = useSort(rows, sort);

  const group = STAT_GROUPS[type];

  return (
    <>
      <View>
        <StatGroups type={type} onChange={setType} />
        {!group.allYears && <YearSelection year={year} minYear={minYear} onChange={setYear} />}
        <HeaderRow columns={group.header} fields={group.columns} flexes={group.flexes} sort={sort} onSort={setSort} />
      </View>

      <FlatList
        style={s.body}
        contentContainerStyle={s.bodyContainer}
        data={rows}
        renderItem={({ item }) => (
          <Row row={item} columns={group.columns} flexes={group.flexes} type={type} year={year} />
        )}
        ListEmptyComponent={<Text>{t('empty')}</Text>}
      />
    </>
  );
}

function useStatParams() {
  const [type, setTypeRaw] = useState(TABS.MONTH);
  const [year, setYearRaw] = useState($readBookCountThisYear.get() > 0 ? CURRENT_YEAR : CURRENT_YEAR - 1);
  const [sort, setSortRaw] = useState<Sort>(null);

  const setType = useCallback(value => {
    setTypeRaw(value);
    setSortRaw(null);
  }, []);

  const setYear = useCallback(value => {
    setYearRaw(value);
    setSortRaw(null);
  }, []);

  const setSort = useCallback(field => {
    setSortRaw(current => {
      if (current === null || current.field !== field) {
        return { field, asc: true };
      }

      return { field, asc: !current.asc };
    });
  }, []);

  return { type, year, sort, setType, setYear, setSort };
}

function useRows(books, minYear, type, year) {
  const rows = useMemo(() => {
    const group = STAT_GROUPS[type];
    let items = books;

    if (!group.allYears && year) {
      items = books.filter(byYear(year));
    }

    return group.factory(items, year);
  }, [books, type, year]);

  return rows;
}

function useSort<T extends IRow>(list: T[], sort: Sort): T[] {
  if (sort && list && list.length) {
    let totalRow = [];

    if (list[list.length - 1].id === 'total') {
      totalRow.push(list[list.length - 1]);
      list = list.slice(0, -1);
    }

    return _.orderBy(list, sort.field, sort.asc ? 'asc' : 'desc').concat(totalRow);
  }

  return list;
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
