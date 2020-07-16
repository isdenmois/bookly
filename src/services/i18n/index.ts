import i18next from 'i18next';

export const i18n = {
  init: () => {
    return i18next.init({
      lng: 'ru',
      debug: true,
      resources: {
        // en: { translation: require('./en.json') },
        ru: { translation: require('./ru.json') },
      },
    });
  },
};

export const t = (key: string, options?): string => i18next.t(key, options);
