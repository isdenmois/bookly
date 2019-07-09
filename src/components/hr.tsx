import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { color } from 'types/colors';

interface Props {
  margin?: number;
}

export function Hr(props: Props) {
  const margin = props.margin || 0;

  return <View style={[s.hr, { marginTop: margin }]} />;
}

const s = StyleSheet.create({
  hr: {
    borderBottomColor: color.Border,
    borderBottomWidth: 0.5,
  } as ViewStyle,
});
