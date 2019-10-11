import React, { memo, useMemo } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

interface Props {
  minYear: number;
  year: number;
  onChange: (year: number) => void;
}

export const YearSelection = memo(({ minYear, year, onChange }: Props) => {
  const years = useMemo(() => createYears(minYear), [minYear]);

  return (
    <View style={{ flexDirection: 'row' }}>
      {years.map(y => (
        <TouchableOpacity key={y} style={{ marginLeft: 10 }} onPress={y === year ? null : () => onChange(y)}>
          <Text>{y || 'Все'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

function createYears(min) {
  const result = [0];
  for (let year = new Date().getFullYear(); year >= min; year--) {
    result.push(year);
  }

  return result;
}
