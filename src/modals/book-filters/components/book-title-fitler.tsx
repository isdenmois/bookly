import React from 'react';
import { observer } from 'mobx-react';
import { ListItem } from 'components';
import { BookFilters } from '../book-filters.service';

interface Props {
  filters: BookFilters;
  onApply: () => void;
}

export const BookTitleFilter = observer(({ filters, onApply }: Props) => {
  const setTitle = React.useCallback(value => filters.setFilter('title', value), [filters]);

  return (
    <ListItem
      label='modal.title'
      keyboardType='default'
      value={filters.title}
      onChange={setTitle}
      onSubmit={onApply}
      clearable
    />
  );
});
