import React, { memo, useMemo } from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import classnames from 'rn-classnames';
import { color } from 'types/colors';
import { getCurrentYear } from 'utils/date';

interface Props {
  minYear: number;
  year: number;
  onChange: (year: number) => void;
}

export const YearSelection = memo(({ minYear, year, onChange }: Props) => {
  const years = useMemo(() => createYears(minYear), [minYear]);

  return (
    <ScrollView horizontal style={s.container} contentContainerStyle={s.scroll}>
      <Text style={s.label}>Год:</Text>

      {years.map(y => (
        <TouchableOpacity
          key={y}
          style={cn('year', y === year && 'selected')}
          onPress={y === year ? null : () => onChange(y)}
        >
          <Text style={cn('text', y === year && 'textSelected')}>{y || 'Все'}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

function createYears(min) {
  const result = [0];
  for (let year = getCurrentYear(); year >= min; year--) {
    result.push(year);
  }

  return result;
}

const s = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 15,
  } as ViewStyle,
  scroll: {
    flexDirection: 'row',
    paddingBottom: 5,
  } as ViewStyle,
  label: {
    fontSize: 18,
    color: color.PrimaryText,
    marginRight: 20,
    paddingVertical: 2,
  } as TextStyle,
  year: {
    paddingHorizontal: 5,
    marginHorizontal: 2,
  } as ViewStyle,
  selected: {
    borderRadius: 15,
    backgroundColor: color.Primary,
  },
  text: {
    fontSize: 18,
    color: color.PrimaryText,
    paddingHorizontal: 7,
    paddingVertical: 2,
  } as TextStyle,
  textSelected: {
    color: color.PrimaryTextInverse,
  } as TextStyle,
});
const cn = classnames(s);
