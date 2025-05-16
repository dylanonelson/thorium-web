import React, { CSSProperties, useCallback, useContext, useRef } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../../resources/locales/en.json";
import settingsStyles from "./assets/styles/settings.module.css";

import CheckIcon from "./assets/icons/check.svg";

import { ThActionsKeys, ThLayoutDirection, ThThemeKeys } from "@/preferences/models/enums";

import { RadioGroupWrapper } from "./Wrappers/RadioGroupWrapper";
import { Radio } from "react-aria-components";

import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";
import { setTheme } from "@/lib/themeReducer";

import classNames from "classnames";
import { buildThemeObject } from "@/preferences/helpers/buildThemeObject";

export const ReadingDisplayTheme = ({ mapArrowNav }: { mapArrowNav?: number }) => {
  const RSPrefs = useContext(PreferencesContext);
  const radioGroupRef = useRef<HTMLDivElement | null>(null);

  const theme = useAppSelector(state => state.theming.theme);
  const colorScheme = useAppSelector(state => state.theming.colorScheme)
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const direction = useAppSelector(state => state.reader.direction);
  const isRTL = direction === ThLayoutDirection.rtl

  const themeItems = useRef(isFXL ? RSPrefs.theming.themes.fxlOrder : RSPrefs.theming.themes.reflowOrder);

  const dispatch = useAppDispatch();

  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: ThThemeKeys) => {
    const themeProps = buildThemeObject<Exclude<ThThemeKeys, ThThemeKeys.auto>>({
      theme: value,
      themeKeys: RSPrefs.theming.themes.keys,
      lightTheme: ThThemeKeys.light,
      darkTheme: ThThemeKeys.dark,
      colorScheme
    })
    await submitPreferences(themeProps);

    dispatch(setTheme(value));
  }, [RSPrefs.theming.themes.keys, submitPreferences, dispatch, colorScheme]);

  // It’s easier to inline styles from preferences for these
  // than spamming the entire app with all custom properties right now
  const doStyles = (t: ThThemeKeys) => {
    let cssProps: CSSProperties = {
      boxSizing: "border-box",
      color: "#999999"
    };

    if (t === ThThemeKeys.auto) {
      cssProps.background = isRTL 
        ? `linear-gradient(148deg, ${ RSPrefs.theming.themes.keys[ThThemeKeys.dark].background } 48%, ${ RSPrefs.theming.themes.keys[ThThemeKeys.light].background } 100%)` 
        : `linear-gradient(148deg, ${ RSPrefs.theming.themes.keys[ThThemeKeys.light].background } 0%, ${ RSPrefs.theming.themes.keys[ThThemeKeys.dark].background } 48%)`;
      cssProps.color = "#ffffff";
      cssProps.border = `1px solid ${ RSPrefs.theming.themes.keys[ThThemeKeys.light].subdue }`;
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
  const handleKeyboardNav = async (e: React.KeyboardEvent) => {
    
    if (mapArrowNav && !isNaN(mapArrowNav)) {
      const findNextVisualTheme = async (perRow: number) => {
        const currentIdx = themeItems.current.findIndex((val) => val === theme);
        const nextIdx = currentIdx + perRow;
        if (nextIdx >= 0 && nextIdx < themeItems.current.length) {
          await updatePreference(themeItems.current[nextIdx]);

          // Focusing here instead of useEffect on theme change so that 
          // it doesn’t steal focus when themes is not the first radio group in the sheet
          if (radioGroupRef.current) {
            const themeToFocus = radioGroupRef.current.querySelector(`#${themeItems.current[nextIdx]}`) as HTMLElement;
            if (themeToFocus) themeToFocus.focus();
          }
        }
      };

      switch(e.code) {
        case "Escape":
          dispatch(setActionOpen({ 
            key: ThActionsKeys.settings,
            isOpen: false 
          })); 
          break;
        case "ArrowUp":
          e.preventDefault();
          await findNextVisualTheme(-mapArrowNav);
          break;
        case "ArrowDown":
          e.preventDefault();
          await findNextVisualTheme(mapArrowNav);
          break;
        case "ArrowLeft":
          e.preventDefault();
          isRTL ? await findNextVisualTheme(1) : await findNextVisualTheme(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          isRTL ? await findNextVisualTheme(-1) : await findNextVisualTheme(1);
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
    <RadioGroupWrapper
      ref={ radioGroupRef }
      standalone={ true }
      label={ Locale.reader.settings.themes.title }
      value={ theme }
      onChange={ async (val) => await updatePreference(val as ThThemeKeys) }
    >
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
              onKeyDown: (async (e: React.KeyboardEvent) => await handleKeyboardNav(e))
            } : {}) }
          >
          <span>{ Locale.reader.settings.themes[t as keyof typeof ThThemeKeys] } { t === theme ? <CheckIcon aria-hidden="true" focusable="false" /> : <></>}</span>
        </Radio>
        ) }
      </div>
    </RadioGroupWrapper>
    </>
  )
}