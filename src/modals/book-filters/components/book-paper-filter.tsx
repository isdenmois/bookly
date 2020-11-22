import React from 'react';
import { useFormState } from 'utils/form';
import { EditableListItem } from './editable-list-item';

const fields = [
  { id: null, key: 'all' },
  { id: 'y', key: 'common.paper' },
  { id: 'e', key: 'common.ebook' },
];

export function BookPaperFilter() {
  const [paper, setPaper] = useFormState('paper');

  return (
    <EditableListItem
      title='modal.format'
      fields={fields}
      labelKey='name'
      value={paper}
      onChange={setPaper}
      clearable
    />
  );
}
