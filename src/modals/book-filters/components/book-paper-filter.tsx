import React from 'react';
import { observer } from 'mobx-react';
import { EditableListItem } from './editable-list-item';

const fields = [
  { id: null, name: 'Все' },
  { id: 'y', name: 'В бумаге' },
  { id: 'n', name: 'В электронке' },
];

export const BookPaperFilter = observer(({ filters }) => {
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
