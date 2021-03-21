import React, { FC } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';

import { CurrentBook } from '../components/current-books';
import { BookChallenge } from '../components/book-challenge';
import { ReadBooks } from '../components/read-books';

export const MainScreen: FC = () => {
  return (
    <ScrollView testID='homeScreen' contentContainerStyle={s.container}>
      <CurrentBook />

      <BookChallenge />

      <ReadBooks />
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: {
    padding: 16,
  } as ViewStyle,
});
