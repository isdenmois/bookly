import React, { useCallback } from 'react';
import { useSetting } from 'services/settings';
import { settings } from 'services';
import { EditableListItem } from 'modals/book-filters/components/editable-list-item';

const ITEMS: any = {
  auto: 'Автоматически',
  dark: 'Темная',
  light: 'Светлая',
};

export function ThemeSelector() {
  const value = useSetting('mode') || 'auto';
  const setField = useCallback(mode => settings.set('mode', mode === 'auto' ? null : mode), []);

  return <EditableListItem title='Тема' fields={ITEMS} value={value} onChange={setField} />;
}
