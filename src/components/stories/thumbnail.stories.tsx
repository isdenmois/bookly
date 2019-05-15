import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { Thumbnail } from '../thumbnail';

storiesOf('Thumbnail').add('Usage', () => (
  <View style={s.centered}>
    <View style={s.row}>
      <Thumbnail
        style={s.thumbnail}
        width={120}
        height={192}
        title='Темная башня'
        url='https://data.fantlab.ru/images/editions/big/4665'
      />

      <Thumbnail style={s.thumbnail} width={120} height={185} title='Темная башня' />
    </View>
  </View>
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
  thumbnail: {
    marginRight: 10,
  },
});
