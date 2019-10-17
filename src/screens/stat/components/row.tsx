import React, { memo, useCallback } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { color } from 'types/colors';
import { Navigation, inject } from 'services';

interface Props {
  row: any;
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
      const date = { from: new Date(year, row.id, 1), to: new Date(year, row.id + 1, 0) };

      openRead({ date });
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
  const style = { color: color.PrimaryText, fontSize: 16 };
  const enabled = transitions[type].enabled(row, year);
  const go = useCallback(() => transitions[type].go(row, year), [row, year]);
  const Component: any = enabled ? TouchableOpacity : View;

  return (
    <Component style={{ flexDirection: 'row', paddingTop: 15 }} onPress={go}>
      {columns.map((c, i) => (
        <Text key={c} style={flexes ? [style, { flex: flexes[i] }] : style}>
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

  navigation.push('ReadList', { filters });
}
