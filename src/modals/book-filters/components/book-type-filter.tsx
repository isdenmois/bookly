import React from 'react';
import { observer } from 'mobx-react';
import { BOOK_TYPE_NAMES } from 'types/book-types';
import { inject } from 'services';
import { EditableListItem } from './editable-list-item';
import { BookFilters } from '../book-filters.service';

export const BookTypeFilter = observer(() => {
  const filters = React.useMemo(() => inject(BookFilters), []);
  const setType = React.useCallback(value => filters.setFilter('type', value), []);

  return (
    <EditableListItem
      title='Тип книги'
      fields={BOOK_TYPE_NAMES as any}
      value={filters.type}
      onChange={setType}
      clearable
    />
  );
});
