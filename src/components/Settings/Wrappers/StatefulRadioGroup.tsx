"use client";

import settingsStyles from "../assets/styles/settings.module.css";

import { ThRadioGroup, ThRadioGroupProps } from "@/core/Components/Settings/ThRadioGroup"

export interface StatefulRadioGroupProps extends Omit<ThRadioGroupProps, "classNames"> {
  standalone?: boolean
}

export const StatefulRadioGroup = ({
  standalone,
  label,
  children,
  ...props
}: StatefulRadioGroupProps) => {
  return (
  <>
  <ThRadioGroup 
    { ...props }
    { ...(standalone ? { label: label } : { "aria-label": label }) }
    className={ standalone ? settingsStyles.readerSettingsGroup : "" }
    compounds={{
      wrapper: {
        className: settingsStyles.readerSettingsRadioWrapper
      },
      label: {
        className: settingsStyles.readerSettingsLabel
      },
      radio: {
        className: settingsStyles.readerSettingsRadio
      }
    }}
  >
    { children }
  </ThRadioGroup>
  </>
  )
}