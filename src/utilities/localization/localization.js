import i18n from 'i18n-js';
import en from './locales/en';

i18n.fallbacks = true;

// import required locales as add here for other languages
i18n.translations = {
  en,
};

export function setI18nLocale(locale) {
  i18n.locale = locale;
}

export function normalizeLanguage(language) {
  return language.replace(/-.*/, '');
}

export function strings(name, params = {}) {
  return i18n.t(name, params);
}
