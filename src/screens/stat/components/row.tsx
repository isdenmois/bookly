import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { color } from 'types/colors';

interface Props {
  row: any;
  columns: string[];
  flexes: number[];
}

export const Row = memo(({ row, columns, flexes }: Props) => {
  const style = { color: color.PrimaryText, fontSize: 16 };

  return (
    <View style={{ flexDirection: 'row', marginTop: 15 }}>
      {columns.map((c, i) => (
        <Text key={c} style={flexes ? [style, { flex: flexes[i] }] : style}>
          {row[c]}
        </Text>
      ))}
    </View>
  );
});
