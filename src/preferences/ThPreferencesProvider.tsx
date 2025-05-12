"use client";

import { createContext } from "react";
import { defaultPreferences } from "./defaultPreferences";

import { IRSPrefs } from "@/models/preferences";

const PreferencesContext = createContext(defaultPreferences);

export default function ThPreferencesProvider({ value, children }: {
  value?: IRSPrefs,
  children: React.ReactNode
}) {
  return (
    <PreferencesContext.Provider value={ value || defaultPreferences }>
      { children }
    </PreferencesContext.Provider>
  );
};

export { ThPreferencesProvider, PreferencesContext };