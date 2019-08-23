import React from 'react';
import { observer } from 'mobx-react';
import { inject } from 'services';
import { ListItem } from 'components';
import { BookFilters } from '../book-filters.service';

interface Props {
  onApply: () => void;
}

export const BookTitleFilter = observer((props: Props) => {
  const filters = React.useMemo(() => inject(BookFilters), []);
  const setTitle = React.useCallback(value => filters.setFilter('title', value), []);

  return (
    <ListItem
      label='Название'
      keyboardType='default'
      value={filters.title}
      onChange={setTitle}
      onSubmit={props.onApply}
      clearable
    />
  );
});
