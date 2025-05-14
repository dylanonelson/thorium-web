"use client";

import { useContext, useEffect } from "react";
import { PreferencesContext } from "./ThPreferencesProvider";
import { ThLayoutDirection } from "./models/enums";

export const ThDirectionSetter = ({ children }: { children: React.ReactNode }) => {
  const RSPrefs = useContext(PreferencesContext);
  
  useEffect(() => {
    if (RSPrefs.direction === ThLayoutDirection.rtl) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [RSPrefs.direction]);

  return children;
};