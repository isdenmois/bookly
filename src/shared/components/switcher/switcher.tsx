import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import cn from 'react-native-classnames';
import { color } from 'constants/colors';

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

export class Switcher extends React.Component<Props> {
  render() {
    const { style, value } = this.props;
    const lastIndex = this.props.options.length - 1;

    return (
      <View style={[s.container, this.props.style]}>
        {this.props.options.map((option, index) => (
          <TouchableOpacity
            style={cn(s, ['option', { selected: option.key === value, lastOption: index === lastIndex }, style])}
            key={option.key}
            onPress={() => this.props.onChange(option.key)}
          >
            <Text style={cn(s, ['text', { selectedText: option.key === value }])}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: color.Green,
    borderWidth: 0.5,
    borderRadius: 5,
    overflow: 'hidden',
  } as ViewStyle,
  option: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: color.Green,
    borderRightWidth: 0.5,
    paddingVertical: 5,
  } as ViewStyle,
  lastOption: {
    borderRightWidth: 0,
  } as ViewStyle,
  selected: {
    backgroundColor: color.Green,
  } as ViewStyle,
  text: {
    color: color.Green,
    fontFamily: 'sans-serif-medium',
    fontSize: 13,
  } as TextStyle,
  selectedText: {
    color: 'white',
  } as TextStyle,
});