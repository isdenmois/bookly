import _ from 'lodash';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Box, Text } from 'components/theme';
import { MainRoutes } from 'navigation/routes';
import { getNavigation, t } from 'services';
import { i18n } from 'services/i18n';
import Book from 'store/book';
import { Tile } from './tile';

type Props = {
  books: Book[];
};

const MONTHS = {
  ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

function getMonthNames(): string[] {
  return MONTHS[i18n.getLocale()];
}

interface Month {
  id: number;
  name: string;
  count: number;
}

export function YearStatistics({ books }: Props) {
  const openStat = () => getNavigation().push(MainRoutes.Stat);

  const monthNames = useMemo(getMonthNames, []);
  const monthsCounts = useMemo(() => {
    const map = new Map<number, number>();

    books.forEach(book => {
      const month = book.date.getMonth();

      map.set(month, (map.get(month) ?? 0) + 1);
    });

    return map;
  }, [books]);
  const max = useMemo(() => [...monthsCounts.values()].reduce((prev, count) => Math.max(prev, count), 1), [
    monthsCounts,
  ]);

  const months: Month[] = [];

  for (let id = new Date().getMonth(); id >= 0; id--) {
    months.push({
      id,
      name: monthNames[id],
      count: monthsCounts.get(id) ?? 0,
    });
  }

  return (
    <Box flexDirection='row'>
      <Tile title={t('home.statistics')} onPress={openStat}>
        <ScrollView horizontal contentContainerStyle={s.scroll}>
          {months.map(m => renderMonth(m, max))}
        </ScrollView>
      </Tile>
    </Box>
  );
}

function renderMonth(month: Month, max: number) {
  const progress = (100 * month.count) / max;
  const quarter = month.id && month.id % 3 === 0;
  const margin = quarter ? 4 : month.id ? 2 : 0;

  return (
    <Box key={month.id} mr={margin}>
      <Box style={s.progress} backgroundColor='grey10'>
        <Box backgroundColor='Primary' height={progress} style={s.progressValue} />

        <Text mb={2} style={s.text} fontSize={12} color='notBlack'>
          {month.count}
        </Text>
      </Box>

      <Text mt={1} fontSize={12} color='notBlack'>
        {month.name}
      </Text>
    </Box>
  );
}

const s = StyleSheet.create({
  progress: {
    position: 'relative',
    borderRadius: 10,
    height: 100,
    width: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  progressValue: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  text: {
    zIndex: 2,
  },
  scroll: {
    paddingTop: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
});
