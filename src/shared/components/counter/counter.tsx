import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { TextXL } from 'components/text';

interface Props {
  value: string | number;
  label: string;
}

export function Counter(props: Props) {
  return (
    <View style={s.container}>
      <TextXL style={s.value}>{props.value}</TextXL>
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
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  } as TextStyle,
  label: {
    color: 'black',
    fontSize: 14,
  } as TextStyle,
});
