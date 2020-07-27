import i18next from 'i18next';
import ruplurProcessor, { rp } from './russian-plural';

export const i18n = {
  init() {
    return i18next
      .use(ruplurProcessor)
      .use(rp)
      .init({
        debug: false,
        lng: 'ru',
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

i18n.init();

export const t = (key: string, options?): string => i18next.t(key, options);
