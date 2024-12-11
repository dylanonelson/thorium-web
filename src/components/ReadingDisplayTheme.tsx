import React from "react";

import Locale from "../resources/locales/en.json";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import CheckIcon from "./assets/icons/check.svg";

import { Label, Radio, RadioGroup } from "react-aria-components";

import classNames from "classnames";

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
  return (
    <>
    <div>
      <RadioGroup 
        orientation="horizontal" 
      >
        <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.themes.title }</Label>
        <div className={ classNames(settingsStyles.readerSettingsRadioWrapper, settingsStyles.readerSettingsThemesWrapper) }>
          { Object.keys(Themes).map(( theme ) => 
            <Radio
              className={ classNames(settingsStyles.readerSettingsRadio, settingsStyles.readerSettingsThemeRadio, settingsStyles[theme]) }
              value={ theme }
              id={ theme }
              key={ theme }
            >
            <span>{ Locale.reader.settings.themes[theme as keyof typeof Themes]} { theme === Themes.auto ? <CheckIcon aria-hidden="true" focusable="false" /> : <></>}</span>
            </Radio>
          ) }
        </div>
      </RadioGroup>
    </div>
    </>
  )
}