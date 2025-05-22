"use client";

import { createContext, useContext, useMemo } from "react";
import { defaultPreferences } from "./defaultPreferences";

import { ThPreferences, CustomizableKeys } from "./preferences";
import { ThDirectionSetter } from "./ThDirectionSetter";

// Define the context with a generic type parameter and ensure non-null value
export const PreferencesContext = createContext<ThPreferences<any>>(defaultPreferences);

export const usePreferences = () => useContext(PreferencesContext);

export function ThPreferencesProvider<T extends Partial<CustomizableKeys> = {}>({
  value,
  children,
}: {
  value?: ThPreferences<T>;
  children: React.ReactNode;
}) {
  const contextValue = useMemo(() => {
    return value || defaultPreferences as unknown as ThPreferences<T>;
  }, [value]);

  return (    
    <PreferencesContext.Provider value={ contextValue }>
      <ThDirectionSetter>
        { children }
      </ThDirectionSetter>
    </PreferencesContext.Provider>
  );
}