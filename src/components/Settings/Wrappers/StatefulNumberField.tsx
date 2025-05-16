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
      compounds={{
        group: {
          className: settingsStyles.readerSettingsGroupWrapper
        },
        label: {
          className: settingsStyles.readerSettingsLabel
        },
        stepper: {
          className: readerSharedUI.icon
        },
        input: {
          className: settingsStyles.readerSettingsInput
        }
      }}
    />
  );
};