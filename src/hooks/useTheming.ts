import { useCallback, useEffect, useRef } from "react";

import { RSPrefs, ThemeKeys } from "@/preferences";

import { useBreakpoints } from "./useBreakpoints"
import { ColorScheme, useColorScheme } from "./useColorScheme";

import { useAppSelector } from "@/lib/hooks";

import { propsToCSSVars } from "@/helpers/propsToCSSVars";

// Takes care of the init of theming and side effects on :root/html
// Reader still has to handle the side effects on Navigator
export const useTheming = () => {
  const breakpoints = useBreakpoints();
  const colorScheme = useColorScheme();
  const colorSchemeRef = useRef(colorScheme);
  const theme = useAppSelector(state => state.theming.theme);

  const inferThemeAuto = useCallback(() => {
    return colorSchemeRef.current === ColorScheme.dark ? ThemeKeys.dark : ThemeKeys.light
  }, []);

  const initThemingCustomProps = useCallback(() => {
    const props = {
      ...propsToCSSVars(RSPrefs.theming.arrow, "arrow"), 
      ...propsToCSSVars(RSPrefs.theming.icon, "icon"),
      ...propsToCSSVars(RSPrefs.theming.layout, "layout")
    } 
    for (let p in props) {
      document.documentElement.style.setProperty(p, props[p])
    }
  }, []);

  const setThemeCustomProps = useCallback((t: ThemeKeys) => {
    if (t === ThemeKeys.auto) t = inferThemeAuto();
  
    const props = propsToCSSVars(RSPrefs.theming.themes.keys[t], "theme");
      
    for (let p in props) {
      document.documentElement.style.setProperty(p, props[p])
    }
  }, [inferThemeAuto]);

  // On mount add custom props to :root/html
  useEffect(() => {
    initThemingCustomProps();
  }, [initThemingCustomProps]);

  // Update theme custom props
  useEffect(() => {
    colorSchemeRef.current = colorScheme;
    setThemeCustomProps(theme);
  }, [setThemeCustomProps, theme, colorScheme]);

  return {
    breakpoints,
    colorScheme,
    inferThemeAuto
  }
}