"use client";

import { createContext } from "react";
import { defaultPreferences } from "./defaultPreferences";

import { ThPreferences } from "./preferences";

const PreferencesContext = createContext<ThPreferences>(defaultPreferences);

export default function ThPreferencesProvider<T extends ThPreferences>({
  value,
  children,
}: {
  value?: T;
  children: React.ReactNode;
}) {
  return (
    <PreferencesContext.Provider value={ value || (defaultPreferences) }>
      {children}
    </PreferencesContext.Provider>
  );
};

export { ThPreferencesProvider, PreferencesContext };