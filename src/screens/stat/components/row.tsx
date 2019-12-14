import React, { memo, useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ToastAndroid } from 'react-native';
import { Database, Q } from '@nozbe/watermelondb';
import _ from 'lodash';
import { color } from 'types/colors';
import { Navigation, inject } from 'services';
import { IRow } from '../tabs/shared';

interface Props {
  row: IRow;
  columns: string[];
  flexes: number[];
  type: string;
  year: number;
}

const transitions = {
  MONTH: {
    enabled(row, year) {
      return year && notTotal(row);
    },
    go(row, year) {
      const date = { from: new Date(year, row.id, 1, 11, 1, 1), to: new Date(year, row.id + 1, 0, 13, 0, 0) };

      openRead({ date });
    },
  },
  AUTHOR: {
    enabled: () => true,
    async go(row, year) {
      const filters: any = {};
      const database = inject(Database);
      const authors: any[] = await database.collections
        .get('authors')
        .query(Q.where('name', Q.eq(row.id)))
        .fetch();

      if (!authors?.[0].id) {
        return ToastAndroid.show('Не удалось открыть автора', ToastAndroid.SHORT);
      }

      if (year) {
        filters.year = year;
      } else {
        filters.minYear = true;
      }

      filters.author = _.pick(authors[0], ['id', 'name']);

      openRead(filters);
    },
  },
  RATING: {
    enabled: notTotal,
    go(row, year) {
      const filters: any = {};

      if (year) {
        filters.year = year;
      } else {
        filters.minYear = true;
      }

      filters.rating = { from: row.id, to: row.id };

      openRead(filters);
    },
  },
  YEAR: {
    enabled: notTotal,
    go(row) {
      openRead({ year: row.id });
    },
  },
};

export const Row = memo(({ row, columns, flexes, type, year }: Props) => {
  const enabled = transitions[type].enabled(row, year);
  const go = useCallback(() => transitions[type].go(row, year), [row, year]);
  const Component: any = enabled ? TouchableOpacity : View;

  return (
    <Component style={s.container} onPress={go}>
      {columns.map((c, i) => (
        <Text key={c} style={flexes ? [s.text, { flex: flexes[i] }] : s.text}>
          {row[c]}
        </Text>
      ))}
    </Component>
  );
});

function notTotal(row) {
  return row.id !== 'total' && row.id !== 'Итого';
}

function openRead(filters: any) {
  const navigation = inject(Navigation);

  navigation.push('ReadList', { filters, sort: { field: 'date', desc: false }, readonly: true });
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 15,
  } as ViewStyle,
  text: {
    color: color.PrimaryText,
    fontSize: 16,
  } as TextStyle,
});
