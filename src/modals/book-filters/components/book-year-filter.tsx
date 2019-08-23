import React from 'react';
import { observer } from 'mobx-react';
import { inject } from 'services';
import { ListItem } from 'components';
import { BookFilters } from '../book-filters.service';

interface Props {
  onApply: () => void;
}

export const BookYearFilter = observer((props: Props) => {
  const filters = React.useMemo(() => inject(BookFilters), []);
  const onChange = React.useCallback(value => setYear(filters, value), []);

  return (
    <ListItem
      label='Год'
      keyboardType='numeric'
      value={filters.year && filters.year.toString()}
      onChange={onChange}
      onSubmit={props.onApply}
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
