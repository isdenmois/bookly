import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { color } from 'types/colors';
import { TextXL } from 'components/text';

interface Props {
  value: string | number;
  label: string;
  testID?: string;
}

export function Counter(props: Props) {
  return (
    <View style={s.container}>
      <TextXL style={s.value} testID={props.testID}>
        {props.value}
      </TextXL>
      <Text style={s.label}>{props.label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
  } as ViewStyle,
  value: {
    color: color.PrimaryText,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  } as TextStyle,
  label: {
    color: color.PrimaryText,
    fontSize: 14,
  } as TextStyle,
});
