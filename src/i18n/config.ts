import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { InitOptions } from "i18next";

export const DEFAULT_CONFIG: InitOptions = {
  fallbackLng: "en",
  load: "all",
  nonExplicitSupportedLngs: true,
  detection: {
    order: ["navigator"],
    caches: []
  },
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json"
  },
  ns: ["thorium-web"],
  defaultNS: "thorium-web"
};

export const initI18n = async (options: Partial<InitOptions> = {}) => {
  if (i18n.isInitialized) {
    return i18n;
  }

  return i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...DEFAULT_CONFIG,
      ...options
    });
};

export { i18n };