import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { session } from 'services';
import { EditableListItem } from 'modals/book-filters/components/editable-list-item';

const ITEMS: any = {
  auto: 'Автоматически',
  dark: 'Темная',
  light: 'Светлая',
};

export const ThemeSelector = observer(() => {
  const setField = useCallback(mode => session.set('mode', mode === 'auto' ? null : mode), []);

  return <EditableListItem title='Тема' fields={ITEMS} value={session.mode || 'auto'} onChange={setField} />;
});
