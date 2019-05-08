import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar } from './avatar';

storiesOf('Avatar').add('Usage', () => (
  <ScrollView style={s.centered}>
    <View style={s.row}>
      <Avatar width={120} height={185} style={s.avatar} title='Ааа' />
      <Avatar width={120} height={185} style={s.avatar} title='Аа Аа' />
    </View>
    <View style={s.row}>
      <Avatar width={120} height={185} style={s.avatar} title='Аа Бб' />
      <Avatar width={120} height={185} style={s.avatar} title='Аа Вв' />
    </View>

    <View style={s.row}>
      <Avatar width={120} height={185} style={s.avatar} title='А Г' />
      <Avatar width={120} height={185} style={s.avatar} title='А Д' />
    </View>

    <View style={s.row}>
      <Avatar width={120} height={185} style={s.avatar} title='А Е' />
      <Avatar width={120} height={185} style={s.avatar} title='А Ж' />
    </View>

    <View style={s.row}>
      <Avatar width={120} height={185} style={s.avatar} title='А З' />
      <Avatar width={120} height={185} style={s.avatar} title='А И' />
    </View>

    <View style={s.row}>
      <Avatar width={120} height={185} style={s.avatar} title='А К' />
      <Avatar width={120} height={185} style={s.avatar} title='А Ё' />
    </View>

    <View style={s.row}>
      <Avatar width={120} height={185} style={s.avatar} title='А Л' />
      <Avatar width={120} height={185} style={s.avatar} title='А М' />
    </View>
  </ScrollView>
));

const s = StyleSheet.create({
  centered: {
    flex: 1,
    flexDirection: 'column',
    padding: 24,
    backgroundColor: 'white',
  },
  row: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  avatar: {
    marginRight: 10,
  },
});
