import React, { memo } from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import { dynamicColor, boldText } from 'types/colors';
import { t } from 'services';

interface Props {
  columns: string[];
  flexes?: number[];
}

export const HeaderRow = memo(({ columns, flexes }: Props) => {
  const s = useDynamicValue(ds);

  return (
    <View style={s.container}>
      {columns.map((c, i) => (
        <Text key={c} style={flexes ? [s.text, { flex: flexes[i] }] : s.text}>
          {t(c)}
        </Text>
      ))}
    </View>
  );
});

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 15,
  } as ViewStyle,
  text: {
    color: dynamicColor.PrimaryText,
    fontSize: 16,
    ...boldText,
  } as TextStyle,
});
