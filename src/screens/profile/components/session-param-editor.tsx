import React, { useMemo, useState, useCallback } from 'react';
import { Session, inject } from 'services';
import { ListItem } from 'components';
import { Setting } from 'services/session';

interface Props {
  title: string;
  prop: Setting;
}

export function SessionEditor({ title, prop }: Props) {
  const session = useMemo(() => inject(Session), []);
  const [value, setValue] = useState(session[prop].toString());
  const save = useCallback(() => +value && session.set(prop, +value), [value]);

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
