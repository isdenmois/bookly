import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, View, Text } from 'react-native';
import { BookItem } from './book-item';

const books: any[] = [
  {
    id: 589,
    title: 'Темная башня',
    author: 'Стивен Кинг',
    thumbnail: 'https://data.fantlab.ru/images/editions/big/4665',
  },
  {
    id: 587,
    title: 'Волки Кальи',
    author: 'Стивен Кинг',
  },
];

storiesOf('BookItem').add('Usage', () => (
  <View style={s.centered}>
    <BookItem book={books[0]} />
    <BookItem book={books[1]} />
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
