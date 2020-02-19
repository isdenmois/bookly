import React from 'react';
import { observer } from 'mobx-react';
import { inject } from 'services';
import { EditableListItem } from './editable-list-item';
import { BookFilters } from '../book-filters.service';

const fields = [
  { id: null, name: 'Все' },
  { id: 'y', name: 'В бумаге' },
  { id: 'n', name: 'В электронке' },
];

export const BookPaperFilter = observer(() => {
  const filters = React.useMemo(() => inject(BookFilters), []);
  const setType = React.useCallback(value => filters.setFilter('paper', value), [filters]);

  return (
    <EditableListItem
      title='Вид книги'
      fields={fields}
      labelKey='name'
      value={filters.paper}
      onChange={setType}
      clearable
    />
  );
});
