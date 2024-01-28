import AsyncStorage from '@react-native-async-storage/async-storage';
export const STORAGE_KEY = 'lang';
export const DEFAULT_LANG = 'ru';

export default {
  init: Function.prototype,
  async: true,
  type: 'languageDetector',
  detect: callback =>
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => value || DEFAULT_LANG)
      .catch(() => DEFAULT_LANG)
      .then(callback),
  cacheUserLanguage: Function.prototype,
};
