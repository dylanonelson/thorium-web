import { createContext, useContext } from "react";
import { defaultPreferences } from "./defaultPreferences";
import { ThPreferences } from "./preferences";

// Create a singleton context instance
export const ThPreferencesContext = createContext<ThPreferences<any>>(defaultPreferences);

export const usePreferences = () => useContext(ThPreferencesContext);