import React from "react";

import Locale from "../resources/locales/en.json";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import CheckIcon from "./assets/icons/check.svg";

import { Label, Radio, RadioGroup } from "react-aria-components";

import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTheme } from "@/lib/readerReducer";

export enum Themes {
  auto = "auto",
  neutral = "neutral",
  sepia = "sepia",
  paper = "paper",
  night = "night",
  contrast1 = "contrast1",
  contrast2 = "contrast2",
  contrast3 = "contrast3",
  contrast4 = "contrast4"
}

export const ReadingDisplayTheme = () => {
  const theme = useAppSelector(state => state.reader.theme);
  const dispatch = useAppDispatch();

  const handleTheme = (value: string) => {
    dispatch(setTheme(value));
  }

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
          { Object.keys(Themes).map(( t ) => 
            <Radio
              className={ classNames(settingsStyles.readerSettingsRadio, settingsStyles.readerSettingsThemeRadio, settingsStyles[t]) }
              value={ t }
              id={ t }
              key={ t }
            >
            <span>{ Locale.reader.settings.themes[t as keyof typeof Themes]} { t === theme ? <CheckIcon aria-hidden="true" focusable="false" /> : <></>}</span>
            </Radio>
          ) }
        </div>
      </RadioGroup>
    </div>
    </>
  )
}