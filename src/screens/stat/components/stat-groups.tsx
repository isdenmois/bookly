import React, { memo } from 'react';
import { Insets, Text, TouchableOpacity, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import classnames from 'rn-classnames';
import { color } from 'types/colors';

interface Props {
  type: string;
  onChange: (type: string) => void;
}

const groups = [
  { id: 'MONTH', title: 'По месяцам' },
  { id: 'AUTHOR', title: 'По автору' },
  { id: 'RATING', title: 'По оценке' },
  { id: 'YEAR', title: 'По годам' },
];
const hitSlop: Insets = { top: 20, right: 20, bottom: 20, left: 20 };

export const StatGroups = memo(({ type, onChange }: Props) => {
  const isLast = i => i === groups.length && 'last';
  const isSelected = group => group.id === type && 'selected';

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll} horizontal>
      {groups.map((group, i) => (
        <TouchableOpacity
          key={group.id}
          hitSlop={hitSlop}
          style={cn('group', isLast(i))}
          onPress={isSelected(group) ? null : () => onChange(group.id)}
        >
          <Text style={cn('text', isSelected(group))}>{group.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderBottomColor: '#eee',
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
    borderBottomColor: color.Primary,
    borderBottomWidth: 3,
  } as ViewStyle,
  text: {
    fontSize: 18,
    paddingBottom: 5,
  } as TextStyle,
});
const cn = classnames(s);
