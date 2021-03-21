import React, { FC } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { Screen } from 'components';

import { CurrentBook } from '../components/current-books';
import { BookChallenge } from '../components/book-challenge';
import { ReadBooks } from '../components/read-books';

export const MainScreen: FC = () => {
  return (
    <Screen>
      <ScrollView testID='homeScreen' contentContainerStyle={s.container}>
        <CurrentBook />

        <BookChallenge />

        <ReadBooks />
      </ScrollView>
    </Screen>
  );
};

const s = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 24,
    flex: 1,
  } as ViewStyle,
});
