import React, { useCallback } from 'react';
import { EditableListItem } from './editable-list-item';
import { usePromise } from 'utils/use-observable';
import { database } from 'store';
import List from 'store/list';
import { useFormState } from '../book-filters.form';

function getAllLists() {
  const lists = database.collections.get<List>('lists');

  return lists.query().fetch();
}

export function BookInListFilter() {
  const lists = usePromise(getAllLists, [], []);
  const [list, setFilter] = useFormState('list');
  const setList = useCallback(value => setFilter(lists.find(i => i.id === value) || null), [lists]);

  return (
    <EditableListItem title='modal.list' fields={lists} labelKey='name' value={list?.id} onChange={setList} clearable />
  );
}
