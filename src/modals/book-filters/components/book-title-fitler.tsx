import React from 'react';
import { useFormState } from 'utils/form';
import { ListItem } from 'components';

export function BookTitleFilter() {
  const [title, setTitle, { onSubmit }] = useFormState('title', '');

  return (
    <ListItem
      label='modal.title'
      keyboardType='default'
      value={title}
      onChange={setTitle}
      onSubmit={onSubmit}
      clearable
    />
  );
}
