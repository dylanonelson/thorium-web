"use client";

import settingsStyles from "./assets/styles/settings.module.css";

import { ThSlider, ThSliderProps } from "@/core/Components/Settings/ThSlider";

import classNames from "classnames";

export interface StatefulSliderProps extends Omit<ThSliderProps, "classNames"> {
  standalone?: boolean;
}

export const StatefulSlider = ({
  standalone,
  label,
  ...props
}: StatefulSliderProps) => {
  return(
    <>
    <ThSlider
      { ...props }
      { ...(standalone ? { label: label } : {"aria-label": label}) }
      className={ classNames(settingsStyles.readerSettingsSlider, standalone ? settingsStyles.readerSettingsGroup : "") }
      compounds={{
        label: {
          className: classNames(settingsStyles.readerSettingsLabel, settingsStyles.readerSettingsSliderLabel)
        },
        output: {
          className: settingsStyles.readerSettingsSliderOutput
        },
        track: {
          className: settingsStyles.readerSettingsSliderTrack
        },
        thumb: {
          className: settingsStyles.readerSettingsSliderThumb
        }
      }}
    />
    </>
  )
}