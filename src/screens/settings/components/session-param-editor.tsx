import React, { useState, useCallback } from 'react';
import { session } from 'services';
import { ListItem } from 'components';
import { Setting } from 'services/session';

interface Props {
  title: string;
  param: Setting;
}

export function SessionEditor({ title, param }: Props) {
  const [value, setValue] = useState(session[param].toString());
  const save = useCallback(() => +value && session.set(param, +value), [value]);

  return (
    <ListItem
      label={title}
      keyboardType='decimal-pad'
      value={value}
      onChange={setValue}
      onSubmit={save}
      onBlur={save}
    />
  );
}
