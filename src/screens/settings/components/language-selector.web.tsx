import React, { useCallback, useState } from 'react';
import { EditableListItem } from 'modals/book-filters/components/editable-list-item';
import { STORAGE_KEY, DEFAULT_LANG } from 'services/i18n/language-detector.web';
import { i18n } from 'services/i18n';

const LANGUAGES = {
  ru: 'Русский',
  en: 'Английский',
};

let lang = window.localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

function setLanguage(value) {
  lang = value;
  window.localStorage.setItem(STORAGE_KEY, value);
  i18n.setLang(value);
}

export function LanguageSelector() {
  const [selected, setSelected] = useState(lang);
  const setLang = useCallback(value => {
    setLanguage(value);
    setSelected(value);
  }, []);

  return <EditableListItem title='Язык' fields={LANGUAGES} value={selected} onChange={setLang} />;
}
