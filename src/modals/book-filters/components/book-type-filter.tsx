import React from 'react';
import { observer } from 'mobx-react';
import { BOOK_TYPE_NAMES } from 'types/book-types';
import { EditableListItem } from './editable-list-item';
import { t } from 'services';

export const BookTypeFilter = observer(({ filters }) => {
  const setType = React.useCallback(value => filters.setFilter('type', value), [filters]);

  return (
    <EditableListItem
      title={t('details.type')}
      fields={BOOK_TYPE_NAMES as any}
      value={filters.type}
      onChange={setType}
      clearable
    />
  );
});
