import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { color } from 'types/colors';

interface Props {
  columns: string[];
  flexes?: number[];
}

export const HeaderRow = memo(({ columns, flexes }: Props) => {
  const style = { color: color.PrimaryText, fontFamily: 'sans-serif-medium', fontSize: 16 };

  return (
    <View style={{ flexDirection: 'row' }}>
      {columns.map((c, i) => (
        <Text key={c} style={flexes ? [style, { flex: flexes[i] }] : style}>
          {c}
        </Text>
      ))}
    </View>
  );
});
