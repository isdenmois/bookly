import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { EditableListItem } from './editable-list-item';
import { usePromise } from 'utils/use-observable';
import { database } from 'store';
import List from 'store/list';

function getAllLists() {
  const lists = database.collections.get<List>('lists');

  return lists.query().fetch();
}

export const BookInListFilter = observer(({ filters }) => {
  const lists = usePromise(getAllLists, [], []);
  const setList = useCallback(value => filters.setFilter('list', lists.find(i => i.id === value) || null), [
    filters,
    lists,
  ]);

  return (
    <EditableListItem
      title='modal.list'
      fields={lists}
      labelKey='name'
      value={filters.list?.id}
      onChange={setList}
      clearable
    />
  );
});
