export const STORAGE_KEY = 'lang';
export const DEFAULT_LANG = 'ru';

export default {
  init: Function.prototype,
  type: 'languageDetector',
  detect: () => window.localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG,
  cacheUserLanguage: Function.prototype,
};
