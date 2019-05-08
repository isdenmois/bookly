import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { Card } from 'components/card';
import { Counter } from './counter';

storiesOf('Counter')
  .add('Usage', () => (
    <View style={s.centered}>
      <Counter label='Прочитано' value='21' />
    </View>
  ))
  .add('Three counters', () => (
    <View style={[s.centered, s.threeContainer]}>
      <Card padding>
        <View style={s.threeRow}>
          <Counter label='Прочитано' value='19' />
          <Counter label='Запланировано' value='80' />
          <Counter label='Опережение' value='2' />
        </View>
      </Card>
    </View>
  ));

const s = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  threeContainer: {
    paddingHorizontal: 24,
    alignItems: 'stretch',
  },
  threeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
