import React, { useMemo } from 'react';
import _ from 'lodash';
import { ScrollView } from 'react-native';
import { BOOK_TYPE_NAMES } from 'types/book-types';
import { BookFilters } from 'types/book-filters';
import { formatRating } from 'components/rating';
import { formatPeriod } from 'modals/book-filters/components/book-date-filter';
import { Tag } from 'components';
import { settings, t } from 'services';

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
  minYear: () => t('common.fromy', { year: settings.minYear }),
  paper: p => (p === 'y' ? 'common.paper' : 'common.ebook'),
  audio: p => (p === 'y' ? 'common.audiobook' : 'common.no-audio'),
  withoutTranslation: p => (p === 'y' ? 'common.original' : 'common.ru'),
  leave: p => (p === 'y' ? 'stat.leave' : 'stat.keep'),
  list: p => p.name,
  reads: () => 'details.reread',
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
