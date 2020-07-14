import React from 'react';
import { observer } from 'mobx-react';
import { ListItem } from 'components';
import { BookFilters } from '../book-filters.service';
import { t } from 'services';

interface Props {
  filters: BookFilters;
  onApply: () => void;
}

export const BookYearFilter = observer(({ filters, onApply }: Props) => {
  const onChange = React.useCallback(value => setYear(filters, value), [filters]);

  return (
    <ListItem
      label={t('year')}
      keyboardType='numeric'
      value={filters.year && filters.year.toString()}
      onChange={onChange}
      onSubmit={onApply}
      clearable
    />
  );
});

function setYear(filters: BookFilters, value: string) {
  if (!value || +value) {
    filters.setFilter('year', +value || null);
    filters.setFilter('date', null);
  }
}
