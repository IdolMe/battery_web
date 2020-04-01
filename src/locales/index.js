// https://www.i18next.com/overview/configuration-options  使用的国际化类库
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from './en';
import zh from './zh';

const agentLang = window.navigator.language;
const language = localStorage.getItem('current-language') || agentLang;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: en
      },
      zh: {
        translations: zh
      }
    },
    lng: language, // 设置语言
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
