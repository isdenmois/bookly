import React from 'react';
import { useFormState } from 'utils/form';
import { BOOK_TYPE_NAMES } from 'types/book-types';
import { EditableListItem } from './editable-list-item';

export function BookTypeFilter() {
  const [type, setType] = useFormState('type');

  return (
    <EditableListItem title='details.type' fields={BOOK_TYPE_NAMES as any} value={type} onChange={setType} clearable />
  );
}
