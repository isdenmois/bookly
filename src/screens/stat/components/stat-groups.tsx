import React, { memo } from 'react';
import { Insets, Text, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native';
import classnames from 'rn-classnames';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';
import { dynamicColor } from 'types/colors';
import { t } from 'services';

interface Props {
  type: string;
  onChange: (type: string) => void;
}

const groups = [
  { id: 'MONTH', title: 'stat.by-month' },
  { id: 'AUTHOR', title: 'stat.by-author' },
  { id: 'RATING', title: 'stat.by-mark' },
  { id: 'YEAR', title: 'stat.by-year' },
  { id: 'TYPE', title: 'stat.by-type' },
];
const hitSlop: Insets = { top: 20, right: 20, bottom: 20, left: 20 };

export const StatGroups = memo(({ type, onChange }: Props) => {
  const isLast = i => i === groups.length && 'last';
  const isSelected = group => group.id === type && 'selected';
  const s = useDynamicValue(ds);
  const cn = classnames(s);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll} horizontal showsHorizontalScrollIndicator={false}>
      {groups.map((group, i) => (
        <TouchableOpacity
          key={group.id}
          hitSlop={hitSlop}
          style={cn('group', isLast(i))}
          onPress={isSelected(group) ? null : () => onChange(group.id)}
        >
          <Text style={cn('text', isSelected(group))}>{t(group.title)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderBottomColor: dynamicColor.LightBackground,
    borderBottomWidth: 1,
  } as ViewStyle,
  scroll: {
    flexDirection: 'row',
    paddingTop: 10,
  } as ViewStyle,
  group: {
    paddingRight: 30,
  } as ViewStyle,
  selected: {
    borderBottomColor: dynamicColor.Primary,
    borderBottomWidth: 3,
  } as ViewStyle,
  text: {
    fontSize: 18,
    paddingBottom: 5,
    color: dynamicColor.PrimaryText,
  } as TextStyle,
});
