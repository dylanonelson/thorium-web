import settingsStyles from "../../assets/styles/readerSettings.module.css";

import { ThSwitch, ThSwitchProps } from "@/packages/Components/Settings/ThSwitch";

export interface WrappedSwitchProps extends Omit<ThSwitchProps, "classNames"> {
  standalone?: boolean;
}

export const SwitchWrapper = ({
  standalone,
  label,
  heading, 
  ...props
}: WrappedSwitchProps) => {
  return(
    <>
    <ThSwitch 
      { ...props }
      { ...(standalone ? { heading: heading } : {}) }
      label={ label }
      className={ settingsStyles.readerSettingsSwitch }
      classNames={{
        wrapper: settingsStyles.readerSettingsGroup,
        heading: settingsStyles.readerSettingsLabel,
        indicator: settingsStyles.readerSettingsSwitchIndicator
      }}
    />
    </>
  )
}