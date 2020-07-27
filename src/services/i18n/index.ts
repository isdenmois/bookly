import i18next from 'i18next';
import languageDetector from './language-detector';

export const i18n = {
  init() {
    return i18next.use(languageDetector).init({
      debug: true,
      resources: {
        en: { translation: require('./en.json') },
        ru: { translation: require('./ru.json') },
      },
    });
  },
  setLang(lang) {
    i18next.changeLanguage(lang);
  },
};

export const t = (key: string, options?): string => i18next.t(key, options);
