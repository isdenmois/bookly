import React, { memo, useCallback } from 'react';
import { Text, View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import { dynamicColor } from 'types/colors';
import { t } from 'services';
import { IRow, TabTransition } from '../tabs/shared';
import { transition as ByMonthTransition } from '../tabs/by-month.factory';
import { transition as ByAuthorTransition } from '../tabs/by-author.factory';
import { transition as ByRatingTransition } from '../tabs/by-rating.factory';
import { transition as ByYearTransition } from '../tabs/by-year.factory';
import { transition as ByTypeTransition } from '../tabs/by-type.factory';

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
  TYPE: ByTypeTransition,
};

export const Row = memo(({ row, columns, flexes, type, year }: Props) => {
  const enabled = transitions[type].enabled(row, year);
  const go = useCallback(() => transitions[type].go(row, year), [row, year]);
  const Component: any = enabled ? TouchableOpacity : View;
  const s = useDynamicValue(ds);

  return (
    <Component style={s.container} onPress={go}>
      {columns.map((c, i) => (
        <Text key={c} style={flexes ? [s.text, { flex: flexes[i] }] : s.text}>
          {c === 'name' || row[c] === 'total' ? t(row.key) : row[c]}
        </Text>
      ))}
    </Component>
  );
});

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    paddingBottom: 15,
  } as ViewStyle,
  text: {
    color: dynamicColor.PrimaryText,
    fontSize: 16,
  } as TextStyle,
});
