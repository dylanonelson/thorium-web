import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";
import settingsStyles from "../assets/styles/settings.module.css";

import { ThNumberField, ThNumberFieldProps } from "@/packages/Components/Settings/ThNumberField";

import classNames from "classnames";

export interface StatefulNumberFieldProps extends Omit<ThNumberFieldProps, "classNames"> {
  standalone?: boolean;
}

export const StatefulNumberField = ({
  standalone,
  label,
  ...props
}: StatefulNumberFieldProps) => {

  return (
    <ThNumberField 
      { ...props }
      { ...(standalone ? { label: label } : { "aria-label": label }) }
      className={ classNames(settingsStyles.readerSettingsNumbfield, standalone ? settingsStyles.readerSettingsGroup : "") }
      classNames={{
        group: settingsStyles.readerSettingsGroupWrapper,
        label: settingsStyles.readerSettingsLabel,
        stepper: readerSharedUI.icon,
        input: settingsStyles.readerSettingsInput
      }}
    />
  );
};