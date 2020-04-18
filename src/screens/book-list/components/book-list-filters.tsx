import React, { useMemo } from 'react';
import _ from 'lodash';
import { ScrollView } from 'react-native';
import { BOOK_TYPE_NAMES } from 'types/book-types';
import { BookFilters } from 'types/book-filters';
import { formatRating } from 'components/rating';
import { formatPeriod } from 'modals/book-filters/components/book-date-filter';
import { Tag } from 'components';
import { session } from 'services';

interface Props {
  filters: Partial<BookFilters>;
  onChange: (filters: Partial<BookFilters>) => void;
}

const i = _.identity;
const filterMap = {
  year: y => (y > 100 ? y : 2000 + y),
  title: i,
  author: a => a.name,
  date: formatPeriod,
  rating: formatRating,
  type: t => BOOK_TYPE_NAMES[t],
  isLiveLib: () => 'LiveLib',
  minYear() {
    return `С ${session.minYear}`;
  },
  paper: p => (p === 'y' ? 'В бумаге' : 'В электронке'),
  audio: p => (p === 'y' ? 'Аудиокнига' : 'Не аудио'),
  withoutTranslation: p => (p === 'y' ? 'В оригинале' : 'На русском'),
  leave: p => (p === 'y' ? 'Отдала' : 'Оставила'),
};

export function BookListFilters({ filters, onChange }: Props) {
  const clears = useMemo(() => createClears(filters, onChange), [filters]);
  const tags = _.map(
    filters,
    (value: string, key) =>
      filterMap[key] && <Tag key={key} title={filterMap[key](value)} onPress={clears[key]} icon='times' />,
  ).filter(i);

  if (!tags.length) {
    return null;
  }

  return <ScrollView horizontal>{tags}</ScrollView>;
}

function createClears(filters: Partial<BookFilters>, onChange: Function) {
  const result = {};

  Object.keys(filters)
    .filter(f => filterMap[f])
    .forEach(f => {
      result[f] = () => onChange(_.omit(filters, [f]));
    });

  return result;
}
