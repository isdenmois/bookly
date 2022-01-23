import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useStore } from '@nanostores/react';

import { $readBookCountThisYear } from 'entities/book';
import { CurrentBook } from 'features/current-books';
import { BookChallenge } from 'features/book-challenge';
import { YearStatisticsTile } from 'features/statistics';
import { ReadBooksTile } from 'features/read-books';

import { Box } from 'components/theme';
import { OpenStatisticsTile } from './open-statistics-tile';

export const MainScreen: FC = () => {
  const readBookCountThisYear = useStore($readBookCountThisYear);

  return (
    <ScrollView testID='homeScreen'>
      <Box backgroundColor='grey70' pb={3}>
        <CurrentBook />
      </Box>

      <Box backgroundColor='homeBlock' pt={1} pb={2} style={s.homeBlock}>
        <BookChallenge />

        {readBookCountThisYear > 0 && <YearStatisticsTile />}
        {readBookCountThisYear > 0 && <ReadBooksTile />}
        {readBookCountThisYear === 0 && <OpenStatisticsTile />}
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
