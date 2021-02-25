import React from 'react';
import { ListItem } from 'components';
import { useFormState } from '../book-filters.form';

export function BookTitleFilter() {
  const [title, setTitle, { submit }] = useFormState('title', '');

  return (
    <ListItem
      label='modal.title'
      keyboardType='default'
      value={title}
      onChange={setTitle}
      onSubmit={submit}
      clearable
    />
  );
}
