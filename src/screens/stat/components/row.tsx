import React, { memo, useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { color } from 'types/colors';
import { IRow, TabTransition } from '../tabs/shared';
import { transition as ByMonthTransition } from '../tabs/by-month.factory';
import { transition as ByAuthorTransition } from '../tabs/by-author.factory';
import { transition as ByRatingTransition } from '../tabs/by-rating.factory';
import { transition as ByYearTransition } from '../tabs/by-year.factory';

interface Props {
  row: IRow;
  columns: string[];
  flexes: number[];
  type: string;
  year: number;
}

const transitions: Record<string, TabTransition> = {
  MONTH: ByMonthTransition,
  AUTHOR: ByAuthorTransition,
  RATING: ByRatingTransition,
  YEAR: ByYearTransition,
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
