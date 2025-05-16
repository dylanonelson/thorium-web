import settingsStyles from "../assets/styles/settings.module.css";

import { ThSwitch, ThSwitchProps } from "@/packages/Components/Settings/ThSwitch";

export interface StatefulSwitchProps extends Omit<ThSwitchProps, "classNames"> {
  standalone?: boolean;
}

export const StatefulSwitch = ({
  standalone,
  label,
  heading, 
  ...props
}: StatefulSwitchProps) => {
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