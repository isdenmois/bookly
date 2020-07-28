import React from 'react';
import { observer } from 'mobx-react';
import { EditableListItem } from './editable-list-item';

const fields = [
  { id: null, key: 'all' },
  { id: 'y', key: 'common.paper' },
  { id: 'e', key: 'common.ebook' },
];

export const BookPaperFilter = observer(({ filters }) => {
  const setType = React.useCallback(value => filters.setFilter('paper', value), [filters]);

  return (
    <EditableListItem
      title='modal.format'
      fields={fields}
      labelKey='name'
      value={filters.paper}
      onChange={setType}
      clearable
    />
  );
});
