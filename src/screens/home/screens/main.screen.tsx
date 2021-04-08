import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Box } from 'components/theme';
import { CurrentBook } from '../components/current-books';
import { BookChallenge } from '../components/book-challenge';
import { ReadBooks } from '../components/read-books';
import { YearStatistics } from '../components/year-statistics';
import { useObservable } from 'utils/use-observable';
import { readBooksThisYearQuery } from '../home.queries';

const getBooks = () => readBooksThisYearQuery().observe();

export const MainScreen: FC = () => {
  const books = useObservable(getBooks, [], []);

  return (
    <ScrollView testID='homeScreen'>
      <Box backgroundColor='grey70' pb={3}>
        <CurrentBook />
      </Box>

      <Box backgroundColor='homeBlock' pt={1} pb={2} style={s.homeBlock}>
        <BookChallenge />

        <YearStatistics books={books} />

        <ReadBooks books={books} />
      </Box>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  homeBlock: {
    marginTop: -24,
    paddingHorizontal: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
