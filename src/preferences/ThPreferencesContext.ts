"use client";

import { createContext } from "react";
import { defaultPreferences } from "./defaultPreferences";
import { ThPreferences } from "./preferences";

// Create a singleton context instance
export const ThPreferencesContext = createContext<ThPreferences<any>>(defaultPreferences);