"use client";

import { useContext, useEffect } from "react";
import { PreferencesContext } from "./ThPreferencesProvider";
import { LayoutDirection } from "./preferences";

export const ThDirectionSetter = ({ children }: { children: React.ReactNode }) => {
  const RSPrefs = useContext(PreferencesContext);
  
  useEffect(() => {
    if (RSPrefs.direction === LayoutDirection.rtl) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [RSPrefs.direction]);

  return children;
};