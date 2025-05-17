"use client";

import { useCallback, useEffect, useRef } from "react";

import { CSSColor } from "../CSSValues";

import { BreakpointsMap, ThBreakpoints, useBreakpoints } from "@/packages/Hooks/useBreakpoints";
import { useReducedMotion } from "@/packages/Hooks/useReducedMotion";
import { useReducedTransparency } from "@/packages/Hooks/useReducedTransparency";
import { ThColorScheme, useColorScheme } from "@/packages/Hooks/useColorScheme";
import { ThContrast, useContrast } from "@/packages/Hooks/useContrast";
import { useForcedColors } from "@/packages/Hooks/useForcedColors";
import { useMonochrome } from "@/packages/Hooks/useMonochrome";

import { propsToCSSVars } from "@/packages/Helpers/propsToCSSVars";

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
  theme: T | "auto";
  lightKey: T;
  darkKey: T;
  themeKeys: Record<T, ThemeTokens>;
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
  lightKey,
  darkKey,
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
    return colorSchemeRef.current === ThColorScheme.dark ? darkKey : lightKey;
  }, [darkKey, lightKey]);

  const initThemingCustomProps = useCallback(() => {
    for (let p in initProps) {
      document.documentElement.style.setProperty(p, initProps[p])
    }
  }, [initProps]);

  const setThemeCustomProps = useCallback((t: T | "auto") => {
    if (t === "auto") t = inferThemeAuto();

    const props = propsToCSSVars(themeKeys[t], "theme");
      
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