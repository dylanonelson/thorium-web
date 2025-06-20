"use client";

import { useCallback, useEffect, useRef } from "react";

import { CSSColor } from "../CSSValues";

import { ThBreakpoints } from "../models/enums";
import { BreakpointsMap, useBreakpoints } from "@/core/Hooks/useBreakpoints";
import { useReducedMotion } from "@/core/Hooks/useReducedMotion";
import { useReducedTransparency } from "@/core/Hooks/useReducedTransparency";
import { ThColorScheme, useColorScheme } from "@/core/Hooks/useColorScheme";
import { ThContrast, useContrast } from "@/core/Hooks/useContrast";
import { useForcedColors } from "@/core/Hooks/useForcedColors";
import { useMonochrome } from "@/core/Hooks/useMonochrome";

import { propsToCSSVars } from "@/core/Helpers/propsToCSSVars";

export interface ThemeTokens {
  background: CSSColor;
  text: CSSColor;
  link: CSSColor;
  visited: CSSColor;
  subdue: CSSColor;
  disable: CSSColor;
  hover: CSSColor;
  onHover: CSSColor;
  select: CSSColor;
  onSelect: CSSColor;
  focus: CSSColor;
  elevate: string;
  immerse: string;
};

export interface useThemingProps<T extends string> {
  theme?: string;
  themeKeys: { [key in T]?: ThemeTokens };
  systemKeys?: {
    light: T;
    dark: T;
  };
  breakpointsMap: BreakpointsMap<number | null>;
  initProps?: Record<string, any>;
  onBreakpointChange?: (breakpoint: ThBreakpoints | null) => void;
  onColorSchemeChange?: (colorScheme: ThColorScheme) => void;
  onContrastChange?: (contrast: ThContrast) => void;
  onForcedColorsChange?: (forcedColors: boolean) => void;
  onMonochromeChange?: (isMonochrome: boolean) => void;
  onReducedMotionChange?: (reducedMotion: boolean) => void;
  onReducedTransparencyChange?: (reducedTransparency: boolean) => void;  
}

// Takes care of the init of theming and side effects on :root/html
// Reader still has to handle the side effects on Navigator
export const useTheming = <T extends string>({
  theme,
  systemKeys,
  themeKeys,
  breakpointsMap,
  initProps,
  onBreakpointChange,
  onColorSchemeChange,
  onContrastChange,
  onForcedColorsChange,
  onMonochromeChange,
  onReducedMotionChange,
  onReducedTransparencyChange,
}: useThemingProps<T>) => {
  const breakpoints = useBreakpoints(breakpointsMap, onBreakpointChange);
  const colorScheme = useColorScheme(onColorSchemeChange);
  const colorSchemeRef = useRef(colorScheme);
  const contrast = useContrast(onContrastChange);
  const forcedColors = useForcedColors(onForcedColorsChange);
  const monochrome = useMonochrome(onMonochromeChange);
  const reducedMotion = useReducedMotion(onReducedMotionChange);
  const reducedTransparency = useReducedTransparency(onReducedTransparencyChange);

  const inferThemeAuto = useCallback(() => {
    return colorSchemeRef.current === ThColorScheme.dark ? systemKeys?.dark : systemKeys?.light;
  }, [systemKeys]);

  const initThemingCustomProps = useCallback(() => {
    for (let p in initProps) {
      document.documentElement.style.setProperty(p, initProps[p])
    }
  }, [initProps]);

  const setThemeCustomProps = useCallback((t?: string) => {
    if (!t) {
      return;
    }

    if (t === "auto") {
      const autoTheme = inferThemeAuto();
      if (!autoTheme) {
        // We are not removing properties cos iframes won’t update
        // Removing here would consequently create a theme inconsistency
        // between the iframe and the main window
        return;
      }
      t = autoTheme;
    }
  
    const themeTokens = themeKeys[t as T];
    if (!themeTokens) {
      // We are not removing properties cos iframes won’t update
      // Removing here would consequently create a theme inconsistency
      // between the iframe and the main window
      return;
    }
  
    const props = propsToCSSVars(themeTokens, "theme");
      
    for (let p in props) {
      document.documentElement.style.setProperty(p, props[p])
    }
  }, [inferThemeAuto, themeKeys]);

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
    inferThemeAuto,
    theme, 
    breakpoints,
    colorScheme,
    contrast, 
    forcedColors, 
    monochrome, 
    reducedMotion, 
    reducedTransparency
  }
}