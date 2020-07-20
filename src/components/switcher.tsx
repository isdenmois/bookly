import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import classnames from 'rn-classnames';
import { dynamicColor, boldText } from 'types/colors';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';

interface Option {
  key: any;
  title: string;
}

interface Props {
  options: Option[];
  value: any;
  style?: ViewStyle;
  onChange: (value: any) => void;
}

export function Switcher({ style, value, options, onChange }: Props) {
  const lastIndex = options.length - 1;
  const s = useDynamicValue(ds);
  const cn = classnames(s);

  return (
    <View style={[s.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          style={cn('option', { selected: option.key === value, lastOption: index === lastIndex })}
          key={option.key}
          onPress={() => onChange(option.key)}
        >
          <Text style={cn('text', { selectedText: option.key === value })}>{option.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
    borderColor: dynamicColor.Primary,
    borderWidth: 0.5,
    borderRadius: 5,
    overflow: 'hidden',
  } as ViewStyle,
  option: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: dynamicColor.Primary,
    borderRightWidth: 0.5,
    paddingVertical: 5,
  } as ViewStyle,
  lastOption: {
    borderRightWidth: 0,
  } as ViewStyle,
  selected: {
    backgroundColor: dynamicColor.Primary,
  } as ViewStyle,
  text: {
    color: dynamicColor.Primary,
    fontSize: 13,
    ...boldText,
  } as TextStyle,
  selectedText: {
    color: dynamicColor.PrimaryTextInverse,
  } as TextStyle,
});
