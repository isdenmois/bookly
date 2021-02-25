import React from 'react';
import { BOOK_TYPE_NAMES } from 'types/book-types';
import { useFormState } from '../book-filters.form';
import { EditableListItem } from './editable-list-item';

export function BookTypeFilter() {
  const [type, setType] = useFormState('type');

  return (
    <EditableListItem title='details.type' fields={BOOK_TYPE_NAMES as any} value={type} onChange={setType} clearable />
  );
}
