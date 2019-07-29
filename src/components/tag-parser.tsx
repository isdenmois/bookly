import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Tag } from 'bbcode-to-react';

export class SpoilerTag extends Tag {
  toReact() {
    // Using parent getComponents() to get children components.
    return <Text style={s.title}>
      {'\n\nСпойлер\n'}
      <Text style={s.text}>
        {super.getComponents()}
      </Text>
      {'\n\n'}
    </Text>;
  }
}

const s = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  } as TextStyle,
  text: {
    fontWeight: 'normal',
    fontSize: 12,
    color: 'grey'
  } as TextStyle,
});
