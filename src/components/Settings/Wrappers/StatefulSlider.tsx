import settingsStyles from "../assets/styles/settings.module.css";

import { ThSlider, ThSliderProps } from "@/packages/Components/Settings/ThSlider";

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
      classNames={{
        label: classNames(settingsStyles.readerSettingsLabel, settingsStyles.readerSettingsSliderLabel),
        output: settingsStyles.readerSettingsSliderOutput,
        track: settingsStyles.readerSettingsSliderTrack,
        thumb: settingsStyles.readerSettingsSliderThumb
      }}
    />
    </>
  )
}