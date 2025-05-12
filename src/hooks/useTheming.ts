import { useCallback, useContext, useEffect, useRef } from "react";

import { PreferencesContext } from "@/preferences";
import { ThemeKeys } from "@/models/theme";

import { useIsClient } from "@/packages/Hooks/useIsClient";
import { Breakpoints, useBreakpoints } from "@/packages/Hooks/useBreakpoints";
import { useReducedMotion } from "@/packages/Hooks/useReducedMotion";
import { useReducedTransparency } from "@/packages/Hooks/useReducedTransparency";
import { ColorScheme, useColorScheme } from "@/packages/Hooks/useColorScheme";
import { Contrast, useContrast } from "@/packages/Hooks/useContrast";
import { useForcedColors } from "@/packages/Hooks/useForcedColors";
import { useMonochrome } from "@/packages/Hooks/useMonochrome";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { 
  setColorScheme, 
  setContrast, 
  setForcedColors, 
  setMonochrome, 
  setReducedMotion, 
  setReducedTransparency, 
  setBreakpoint
} from "@/lib";

import { propsToCSSVars } from "@/helpers/propsToCSSVars";

// Takes care of the init of theming and side effects on :root/html
// Reader still has to handle the side effects on Navigator
export const useTheming = () => {
  const RSPrefs = useContext(PreferencesContext);
  const isClient = useIsClient();

  const dispatch = useAppDispatch();

  const breakpoints = useBreakpoints(RSPrefs.theming.breakpoints, ((breakpoint: Breakpoints | null) => dispatch(setBreakpoint(breakpoint))));
  const reducedMotion = useReducedMotion((reducedMotion: boolean) => dispatch(setReducedMotion(reducedMotion)));
  const reducedTransparency = useReducedTransparency((reducedTransparency: boolean) => dispatch(setReducedTransparency(reducedTransparency)));
  const monochrome = useMonochrome((isMonochrome: boolean) => dispatch(setMonochrome(isMonochrome)));
  const colorScheme = useColorScheme((colorScheme: ColorScheme) => dispatch(setColorScheme(colorScheme)));
  const colorSchemeRef = useRef(colorScheme);
  const contrast = useContrast((contrast: Contrast) => dispatch(setContrast(contrast)));
  const forcedColors = useForcedColors((forcedColors: boolean) => dispatch(setForcedColors(forcedColors)));
  const theme = useAppSelector(state => state.theming.theme);

  const inferThemeAuto = useCallback(() => {
    return colorSchemeRef.current === ColorScheme.dark ? ThemeKeys.dark : ThemeKeys.light
  }, []);

  const initThemingCustomProps = useCallback(() => {
    if (!isClient) return;

    const props = {
      ...propsToCSSVars(RSPrefs.theming.arrow, "arrow"), 
      ...propsToCSSVars(RSPrefs.theming.icon, "icon"),
      ...propsToCSSVars(RSPrefs.theming.layout, "layout")
    } 
    for (let p in props) {
      document.documentElement.style.setProperty(p, props[p])
    }
  }, [isClient, RSPrefs.theming.arrow, RSPrefs.theming.icon, RSPrefs.theming.layout]);

  const setThemeCustomProps = useCallback((t: ThemeKeys) => {
    if (!isClient) return;

    if (t === ThemeKeys.auto) t = inferThemeAuto();
  
    const props = propsToCSSVars(RSPrefs.theming.themes.keys[t], "theme");
      
    for (let p in props) {
      document.documentElement.style.setProperty(p, props[p])
    }
  }, [isClient, inferThemeAuto, RSPrefs.theming.themes.keys]);

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
    reducedMotion, 
    reducedTransparency, 
    monochrome, 
    theme, 
    colorScheme,
    contrast, 
    forcedColors, 
    inferThemeAuto
  }
}