import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";
import settingsStyles from "../../assets/styles/readerSettings.module.css";

import { ThNumberField, ThNumberFieldProps } from "@/packages/Components/Settings/ThNumberField";

import classNames from "classnames";

export interface WrappedNumberFieldProps extends Omit<ThNumberFieldProps, "classNames"> {
  standalone?: boolean;
}

export const NumberFieldWrapper = ({
  standalone,
  label,
  ...props
}: WrappedNumberFieldProps) => {

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