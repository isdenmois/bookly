import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  margin?: number;
}

export function Hr(props: Props) {
  const margin = props.margin || 0;

  return <View style={[s.hr, { marginTop: margin }]} />;
}

const s = StyleSheet.create({
  hr: {
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
  } as ViewStyle,
});
