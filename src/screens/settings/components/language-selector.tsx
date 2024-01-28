import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditableListItem } from 'modals/book-filters/components/editable-list-item';
import { STORAGE_KEY } from 'services/i18n/language-detector.web';
import { i18n } from 'services/i18n';

const LANGUAGES = {
  ru: 'Русский',
  en: 'Английский',
};

function setLanguage(value) {
  AsyncStorage.setItem(STORAGE_KEY, value);
  i18n.setLang(value);
}

export function LanguageSelector() {
  const [selected, setSelected] = useState(i18n.getLocale());
  const setLang = useCallback(value => {
    setLanguage(value);
    setSelected(value);
  }, []);

  return <EditableListItem title='Язык' fields={LANGUAGES} value={selected} onChange={setLang} />;
}
