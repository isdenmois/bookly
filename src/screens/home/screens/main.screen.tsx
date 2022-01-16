import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { CurrentBook } from 'features/current-books';
import { BookChallenge } from 'features/book-challenge';
import { YearStatisticsTile } from 'features/statistics';
import { ReadBooksTile } from 'features/read-books';

import { Box } from 'components/theme';

export const MainScreen: FC = () => {
  return (
    <ScrollView testID='homeScreen'>
      <Box backgroundColor='grey70' pb={3}>
        <CurrentBook />
      </Box>

      <Box backgroundColor='homeBlock' pt={1} pb={2} style={s.homeBlock}>
        <BookChallenge />

        <YearStatisticsTile />

        <ReadBooksTile />
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
