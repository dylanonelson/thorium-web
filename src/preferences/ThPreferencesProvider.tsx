"use client";

import { createContext, useMemo, useRef } from "react";
import { defaultPreferences } from "./defaultPreferences";

import { ThPreferences, CustomizableKeys } from "./preferences";
import { ThDirectionSetter } from "./ThDirectionSetter";

// Define the context with a generic type parameter and ensure non-null value
export const PreferencesContext = createContext<ThPreferences<any>>(defaultPreferences);

export function ThPreferencesProvider<T extends Partial<CustomizableKeys> = {}>({
  value,
  children,
}: {
  value?: ThPreferences<T>;
  children: React.ReactNode;
}) {
  const contextRef = useRef<ThPreferences<T> | undefined>(undefined);
  if (!contextRef.current) {
    contextRef.current = value || defaultPreferences as unknown as ThPreferences<T>;
  }

  console.log("contextValue", contextRef.current);

  return (    
    <PreferencesContext.Provider value={ contextRef.current }>
      <ThDirectionSetter>
        { children }
      </ThDirectionSetter>
    </PreferencesContext.Provider>
  );
}