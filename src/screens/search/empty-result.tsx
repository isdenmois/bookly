import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { TextXL } from 'components/text';

export class EmptyResult extends React.Component {
  render() {
    return (
      <View style={s.container}>
        <TextXL style={s.notFoundText}>Ничего не найдено :(</TextXL>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 38,
  } as ViewStyle,
  notFoundText: {
    color: '#90A4AE',
  } as TextStyle,
});
