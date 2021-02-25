import React from 'react';
import { ListItem } from 'components';
import { useForm } from '../book-filters.form';

export function BookYearFilter() {
  const { form, submit, useValue } = useForm();
  const onChange = React.useCallback(value => setYear(form, value), []);
  const year = useValue('year');

  return (
    <ListItem
      label='year'
      keyboardType='numeric'
      value={year && String(year)}
      onChange={onChange}
      onSubmit={submit}
      clearable
    />
  );
}

function setYear(form, value: string) {
  if (!value || +value) {
    form.set('year', +value || null);
    form.set('date', null);
  }
}
