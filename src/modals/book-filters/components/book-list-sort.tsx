import React, { useCallback, useMemo } from 'react';
import _ from 'lodash';
import { useColor } from 'types/colors';
import { TouchIcon } from 'components';
import { EditableListItem } from './editable-list-item';
import { useFormState } from '../book-filters.form';

const FIELDS = [
  { id: 'date', key: 'modal.date' },
  { id: 'title', key: 'modal.title' },
  { id: 'rating', key: 'modal.rating' },
  { id: 'author', key: 'author' },
  { id: 'id', name: 'id' },
  { id: 'createdAt', key: 'modal.by-add' },
];

interface Props {
  title?: string;
  fields: string[];
  value: any;
  onChange: (params: any) => void;
}

export function BookListSort({ title, fields, value, onChange }: Props) {
  const color = useColor();

  const toggleDesc = useCallback(() => {
    onChange({ field: value.field, desc: !value.desc });
  }, [value]);

  const setField = useCallback(field => onChange({ field, desc: value.desc }), [value.desc]);
  const listFields: any = useMemo(() => _.pickBy(FIELDS, f => fields.includes(f.id)), [fields]);

  return (
    <EditableListItem
      title={title || 'modal.sort'}
      fields={listFields}
      value={value.field}
      labelKey='name'
      onChange={setField}
    >
      <TouchIcon
        name={value.desc ? 'sort-alpha-up' : 'sort-alpha-down'}
        paddingVertical={15}
        paddingLeft={15}
        size={18}
        color={color.PrimaryText}
        onPress={toggleDesc}
      />
    </EditableListItem>
  );
}

export function FormBookListSort({ fields }) {
  const [value, onChange] = useFormState('sort');

  return <BookListSort fields={fields} value={value} onChange={onChange} />;
}
