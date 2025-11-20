import { useTranslation } from "react-i18next";

/**
 * Hook to access the i18n instance and translation functions
 * @param ns The namespace to use for translations (defaults to DEFAULT_NAMESPACE)
 * @returns Translation functions and i18n instance
 */
export const useI18n = (ns: string = "thorium-web") => {
  const { t, i18n, ready } = useTranslation(ns);

  // Helper function to change language
  const changeLanguage = (lng: string) => {
    return i18n.changeLanguage(lng);
  };

  return {
    // Translation function
    t,
    // i18n instance
    i18n,
    // Whether translations are loaded
    ready,
    // Current language
    currentLanguage: i18n.language,
    // List of available languages
    languages: i18n.languages,
    // Function to change language
    changeLanguage,
  };
};
