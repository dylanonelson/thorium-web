import React, { CSSProperties } from "react";

import { RSPrefs, Themes } from "@/preferences";
import Locale from "../resources/locales/en.json";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import CheckIcon from "./assets/icons/check.svg";

import { Label, Radio, RadioGroup } from "react-aria-components";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTheme } from "@/lib/readerReducer";

import classNames from "classnames";

export const ReadingDisplayTheme = () => {
  const theme = useAppSelector(state => state.reader.theme);
  const dispatch = useAppDispatch();

  const handleTheme = (value: string) => {
    dispatch(setTheme(value));
  };

  // Yeah so it’s easier to inline styles from preferences for these
  // than spamming the entire app with all custom properties right now
  const doStyles = (t: Themes) => {
    let cssProps: CSSProperties = {
      border: `1px solid ${ RSPrefs.theming.semantic.subdued }`,
      boxSizing: "border-box",
      color: "#999999"
    };

    if (t === Themes.auto) {
      cssProps.background = `linear-gradient(to right bottom, ${ RSPrefs.theming.themes[Themes.light].backgroundColor } 50%, ${ RSPrefs.theming.themes[Themes.dark].backgroundColor } 50.3%)`;
      cssProps.color = "#FFFFFF"
    } else {
      cssProps.background = RSPrefs.theming.themes[t].backgroundColor;
      cssProps.color = RSPrefs.theming.themes[t].color;
    };
    
    return cssProps;
  };

  return (
    <>
    <div>
      <RadioGroup 
        orientation="horizontal" 
        value={ theme }
        onChange={ handleTheme }
      >
        <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.themes.title }</Label>
        <div className={ classNames(settingsStyles.readerSettingsRadioWrapper, settingsStyles.readerSettingsThemesWrapper) }>
          { RSPrefs.theming.themes.displayOrder.map(( t ) => 
            <Radio
              className={ classNames(
                settingsStyles.readerSettingsRadio, 
                settingsStyles.readerSettingsThemeRadio
              ) }
              value={ t }
              id={ t }
              key={ t }
              style={ doStyles(t) }
            >
            <span style={ t === Themes.auto ? { mixBlendMode: "difference" } : {}}>{ Locale.reader.settings.themes[t as keyof typeof Themes] } { t === theme ? <CheckIcon aria-hidden="true" focusable="false" /> : <></>}</span>
            </Radio>
          ) }
        </div>
      </RadioGroup>
    </div>
    </>
  )
}