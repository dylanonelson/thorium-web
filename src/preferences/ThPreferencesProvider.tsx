"use client";

import { useMemo } from "react";
import { defaultPreferences } from "./defaultPreferences";

import { ThPreferences, CustomizableKeys } from "./preferences";
import { ThDirectionSetter } from "./ThDirectionSetter";
import { ThPreferencesContext } from "./ThPreferencesContext";

export function ThPreferencesProvider<T extends Partial<CustomizableKeys>>({
  value,
  children,
}: {
  value?: ThPreferences<T>;
  children: React.ReactNode;
}) {
  const contextValue = useMemo(() => {
    return value || defaultPreferences as ThPreferences<T>;
  }, [value]);

  return (    
    <ThPreferencesContext.Provider value={ contextValue }>
      <ThDirectionSetter direction={ contextValue.direction }>
        { children }
      </ThDirectionSetter>
    </ThPreferencesContext.Provider>
  );
}