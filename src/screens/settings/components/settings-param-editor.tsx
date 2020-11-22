import React, { useState, useCallback } from 'react';
import { ListItem } from 'components';
import { settings, Setting } from 'services/settings';

interface Props {
  title: string;
  param: Setting;
}

export function SettingsEditor({ title, param }: Props) {
  const [value, setValue] = useState(settings[param].toString());
  const save = useCallback(() => +value && settings.set(param, +value), [value]);

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
