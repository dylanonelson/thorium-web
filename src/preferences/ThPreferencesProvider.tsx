"use client";

import { createContext } from "react";
import { defaultPreferences } from "./defaultPreferences";

import { ThPreferences } from "./preferences";

const PreferencesContext = createContext(defaultPreferences);

export default function ThPreferencesProvider({ value, children }: {
  value?: ThPreferences,
  children: React.ReactNode
}) {
  return (
    <PreferencesContext.Provider value={ value || defaultPreferences }>
      { children }
    </PreferencesContext.Provider>
  );
};

export { ThPreferencesProvider, PreferencesContext };