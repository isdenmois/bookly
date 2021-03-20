import React, { memo, useMemo } from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import classnames from 'rn-classnames';
import { dynamicColor } from 'types/colors';
import { getCurrentYear } from 'utils/date';
import { t } from 'services';

interface Props {
  minYear: number;
  year: number;
  onChange: (year: number) => void;
}

export const YearSelection = memo(({ minYear, year, onChange }: Props) => {
  const years = useMemo(() => createYears(minYear), [minYear]);
  const s = useDynamicValue(ds);
  const cn = classnames(s);

  return (
    <ScrollView horizontal style={s.container} contentContainerStyle={s.scroll} showsHorizontalScrollIndicator={false}>
      <Text style={s.label}>{t('year')}:</Text>

      {years.map(y => (
        <TouchableOpacity
          key={y}
          style={cn('year', y === year && 'selected')}
          onPress={y === year ? null : () => onChange(y)}
        >
          <Text style={cn('text', y === year && 'textSelected')}>{y || t('all')}</Text>
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

const ds = new DynamicStyleSheet({
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
    color: dynamicColor.PrimaryText,
    marginRight: 20,
    paddingVertical: 2,
  } as TextStyle,
  year: {
    paddingHorizontal: 5,
    marginHorizontal: 2,
  } as ViewStyle,
  selected: {
    borderRadius: 15,
    backgroundColor: dynamicColor.Primary,
  },
  text: {
    fontSize: 18,
    color: dynamicColor.PrimaryText,
    paddingHorizontal: 7,
    paddingVertical: 2,
  } as TextStyle,
  textSelected: {
    color: dynamicColor.PrimaryTextInverse,
  } as TextStyle,
});
