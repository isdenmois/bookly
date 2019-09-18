import React, { useMemo } from 'react';
import _ from 'lodash';
import { ScrollView } from 'react-native';
import { BOOK_TYPE_NAMES } from 'types/book-types';
import { BookFilters } from 'types/book-filters';
import { formatRating } from 'components/rating';
import { formatPeriod } from 'modals/book-filters/components/book-date-filter';
import { Tag } from 'components';

interface Props {
  filters: Partial<BookFilters>;
  onChange: (filters: Partial<BookFilters>) => void;
}

const i = _.identity;
const filterMap = {
  year: i,
  title: i,
  author: a => a.name,
  date: formatPeriod,
  rating: formatRating,
  type: t => BOOK_TYPE_NAMES[t],
};

export function BookListFilters({ filters, onChange }: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
