import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import id from './id.json';
import cn from './cn.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  // lng: 'id-ID',
  lng: 'en-US',
  fallbackLng: 'id',
  resources: {
    cn: {
      translation: cn,
    },
    en: {
      translation: en,
    },
    id: {
      translation: id,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
