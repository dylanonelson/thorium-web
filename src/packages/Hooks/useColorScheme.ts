"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";

export enum ColorScheme {
  light = "light",
  dark = "dark"
}

export const useColorScheme = (onChange?: (colorScheme: ColorScheme) => void) => {
  const [colorScheme, setColorScheme] = useState(ColorScheme.light);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    const scheme = prefersDarkMode ? ColorScheme.dark : ColorScheme.light;
    setColorScheme(scheme);
    onChange && onChange(scheme);
  }, [onChange, prefersDarkMode]);

  return colorScheme;
}