import React from 'react';
import { BookListSort as BookListSortListItem } from 'modals/book-filters/components/book-list-sort';
import { WISH_LIST_SORTS } from 'screens/book-list/wish-list.screen';
import { useSettingState } from 'services/settings';

export function BookListSort() {
  const [value, onChange] = useSettingState('defaultSort');

  return (
    <BookListSortListItem title='Сортировка по-умолчанию' fields={WISH_LIST_SORTS} value={value} onChange={onChange} />
  );
}
