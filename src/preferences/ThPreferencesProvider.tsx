"use client";

import { createContext } from "react";
import { defaultPreferences } from "./defaultPreferences";

import { ThPreferences, CustomizableKeys } from "./preferences";

// Define the context with a generic type parameter
const PreferencesContext = createContext<ThPreferences<any>>(defaultPreferences);

export default function ThPreferencesProvider<T extends Partial<CustomizableKeys> = {}>({
  value,
  children,
}: {
  value?: ThPreferences<T>;
  children: React.ReactNode;
}) {
  return (
    <PreferencesContext.Provider value={value || (defaultPreferences as unknown as ThPreferences<T>)}>
      {children}
    </PreferencesContext.Provider>
  );
};

export { ThPreferencesProvider, PreferencesContext };