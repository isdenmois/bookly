import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import { useCallback } from 'react';
import { createState } from 'utils/state';

const INITIAL_BOOKS_COUNT = 80;
const INITIAL_SORT = { field: 'title', desc: false };
const INITIAL_YEAR = 2012;

const INITIAL_SETTINGS = <const>{
  userId: null,
  totalBooks: INITIAL_BOOKS_COUNT,
  withFantlab: false,
  saveDateInChangeStatus: false,
  audio: false,
  withoutTranslation: false,
  paper: false,
  persistState: false,
  topRate: false,
  defaultSort: INITIAL_SORT,
  mode: null,
  authors: false,
  fantlabAuth: '',
  minYear: INITIAL_YEAR,
};

export type Setting = keyof typeof INITIAL_SETTINGS;
export const SETTINGS_FIELDS = Object.keys(INITIAL_SETTINGS);

export const [settings, useSetting] = createState(INITIAL_SETTINGS);
export function useSettingState(field) {
  const value = useSetting(field);
  const setValue = useCallback(newValue => settings.set(field, newValue), [field]);

  return <const>[value, setValue];
}

export function resetSettings() {
  settings.multiSet(INITIAL_SETTINGS);

  return AsyncStorage.clear();
}

export function serialize() {
  return _.pickBy(settings, (value: any, key: any) => {
    if (!SETTINGS_FIELDS.includes(key)) return false;
    if (key in INITIAL_SETTINGS) return !_.isEqual(value, INITIAL_SETTINGS[key]);

    return Boolean(value);
  });
}
