import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationNE from "./locales/ne/translation.json";

const resources = {
  en: { translation: translationEN },
  ne: { translation: translationNE },
  
};

i18n
  .use(initReactI18next) // IMPORTANT: injects i18next into react-i18next
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: { escapeValue: false }, // react already escapes
  });

export default i18n;
