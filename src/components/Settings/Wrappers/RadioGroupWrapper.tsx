import settingsStyles from "../assets/styles/settings.module.css";

import { ThRadioGroup, ThRadioGroupProps } from "@/packages/Components/Settings/ThRadioGroup"

export interface WrappedRadioGroupProps extends Omit<ThRadioGroupProps, "classNames"> {
  standalone?: boolean
}

export const RadioGroupWrapper = ({
  standalone,
  label,
  ...props
}: WrappedRadioGroupProps) => {
  return (
  <>
  <ThRadioGroup 
    { ...props }
    { ...(standalone ? { label: label } : { "aria-label": label }) }
    className={ standalone ? settingsStyles.readerSettingsGroup : "" }
    classNames={{
      wrapper: settingsStyles.readerSettingsRadioWrapper,
      label: settingsStyles.readerSettingsLabel,
      radio: settingsStyles.readerSettingsRadio
    }}
  >
    { props.children }
  </ThRadioGroup>
  </>
  )
}