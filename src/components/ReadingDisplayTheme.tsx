import React, { CSSProperties, useEffect, useRef } from "react";

import { RSPrefs, ThemeKeys } from "@/preferences";
import Locale from "../resources/locales/en.json";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import CheckIcon from "./assets/icons/check.svg";

import { Label, Radio, RadioGroup } from "react-aria-components";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTheme } from "@/lib/themeReducer";

import classNames from "classnames";
import { setSettingsOpen } from "@/lib/readerReducer";

export const ReadingDisplayTheme = ({ mapArrowNav }: { mapArrowNav?: number }) => {
  const radioGroupRef = useRef<HTMLDivElement | null>(null);
  const theme = useAppSelector(state => state.theming.theme);
  const isFXL = useAppSelector(state => state.publication.isFXL);

  const themeItems = useRef(isFXL ? RSPrefs.theming.themes.fxlOrder : RSPrefs.theming.themes.reflowOrder);

  const dispatch = useAppDispatch();

  const handleTheme = (value: string) => {
    dispatch(setTheme(value));
  };

  // Yeah so it’s easier to inline styles from preferences for these
  // than spamming the entire app with all custom properties right now
  const doStyles = (t: ThemeKeys) => {
    let cssProps: CSSProperties = {
      boxSizing: "border-box",
      color: "#999999"
    };

    if (t === ThemeKeys.auto) {
      cssProps.background = `linear-gradient(148deg, ${ RSPrefs.theming.themes.keys[ThemeKeys.light].background } 0%, ${ RSPrefs.theming.themes.keys[ThemeKeys.dark].background } 48%)`;
      cssProps.color = "#ffffff";
      cssProps.border = `1px solid ${ RSPrefs.theming.themes.keys[ThemeKeys.light].subdue }`;
    } else {
      cssProps.background = RSPrefs.theming.themes.keys[t].background;
      cssProps.color = RSPrefs.theming.themes.keys[t].text;
      cssProps.border = `1px solid ${ RSPrefs.theming.themes.keys[t].subdue }`;
    };
    
    return cssProps;
  };

  // mapArrowNav is the number of columns. This assumption 
  // should be safe since even in vertical-writing, 
  // the layout should be horizontal (?)
  const handleKeyboardNav = (e: React.KeyboardEvent) => {
    if (mapArrowNav && !isNaN(mapArrowNav)) {
      const findNextVisualTheme = (perRow: number) => {
        const currentIdx = themeItems.current.findIndex((val) => val === theme);
        const nextIdx = currentIdx + perRow;
        if (nextIdx >= 0 && nextIdx < themeItems.current.length) {
          dispatch(setTheme(themeItems.current[nextIdx]));
        }
      };

      switch(e.code) {
        case "Escape":
          dispatch(setSettingsOpen(false)); 
          break;
        case "ArrowUp":
          e.preventDefault();
          findNextVisualTheme(-mapArrowNav);
          break;
        case "ArrowDown":
          e.preventDefault();
          findNextVisualTheme(mapArrowNav);
          break;
        case "ArrowLeft":
          e.preventDefault();
          findNextVisualTheme(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          findNextVisualTheme(1);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (mapArrowNav && !isNaN(mapArrowNav) && radioGroupRef.current) {
      const themeToFocus = radioGroupRef.current.querySelector(`#${theme}`) as HTMLElement;
      if (themeToFocus) themeToFocus.focus();
    }
  }, [theme]);

  return (
    <>
    <div>
      <RadioGroup 
        ref={ radioGroupRef }
        orientation="horizontal" 
        value={ theme }
        onChange={ handleTheme }
      >
        <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.themes.title }</Label>
        <div className={ classNames(settingsStyles.readerSettingsRadioWrapper, settingsStyles.readerSettingsThemesWrapper) }>
          { themeItems.current.map(( t ) => 
            <Radio
              className={ classNames(
                settingsStyles.readerSettingsRadio, 
                settingsStyles.readerSettingsThemeRadio
              ) }
              value={ t }
              id={ t }
              key={ t }
              style={ doStyles(t) }
              { ...(mapArrowNav && !isNaN(mapArrowNav) ? {
                onKeyDown: handleKeyboardNav
              } : {}) }
            >
            <span>{ Locale.reader.settings.themes[t as keyof typeof ThemeKeys] } { t === theme ? <CheckIcon aria-hidden="true" focusable="false" /> : <></>}</span>
            </Radio>
          ) }
        </div>
      </RadioGroup>
    </div>
    </>
  )
}