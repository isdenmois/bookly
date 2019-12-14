import React, { memo } from 'react';
import { Text, View, ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { color } from 'types/colors';

interface Props {
  columns: string[];
  flexes?: number[];
}

export const HeaderRow = memo(({ columns, flexes }: Props) => {
  return (
    <View style={s.container}>
      {columns.map((c, i) => (
        <Text key={c} style={flexes ? [s.text, { flex: flexes[i] }] : s.text}>
          {c}
        </Text>
      ))}
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 15,
  } as ViewStyle,
  text: {
    color: color.PrimaryText,
    fontFamily: 'sans-serif-medium',
    fontSize: 16,
  } as TextStyle,
});
