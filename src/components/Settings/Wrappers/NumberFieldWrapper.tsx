import React from "react";

import { ISettingsNumberFieldProps } from "@/models/settings";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";
import settingsStyles from "../../assets/styles/readerSettings.module.css";

import { Button, Group, Input, Label, NumberField, NumberFieldProps } from "react-aria-components";

import classNames from "classnames";

export const NumberFieldWrapper: React.FC<NumberFieldProps & ISettingsNumberFieldProps> = ({
  className,
  label,
  defaultValue,
  value,
  onChangeCallback,
  range,
  step,
  steppers,
  format,
  disabled,
  wheelDisabled,
  virtualKeyboardDisabled,
  readOnly,
  ...props
}) => {

  return (
    <NumberField 
      className={ classNames(settingsStyles.readerSettingsGroup, className) }
      defaultValue={ defaultValue }
      value={ value }
      minValue={ range[0] }
      maxValue={ range[1] }
      step={ step }
      formatOptions={ format } 
      onChange={ onChangeCallback }
      decrementAriaLabel={ steppers.decrementLabel }
      incrementAriaLabel={ steppers.incrementLabel }
      isDisabled={ disabled }
      isWheelDisabled={ wheelDisabled }
      { ...props }
    >
      <Label className={ settingsStyles.readerSettingsLabel }>
        { label}
      </Label>

      <Group className={ settingsStyles.readerSettingsGroupWrapper }>
        <Button 
          slot="decrement" 
          className={ readerSharedUI.icon }
        >
          <steppers.decrementIcon aria-hidden="true" focusable="false" /> 
        </Button>

        <Input 
          className={ settingsStyles.readerSettingsInput } 
          readOnly={ readOnly } 
          { ...(virtualKeyboardDisabled ? { inputMode: "none" } : {}) } 
        />

        <Button 
          slot="increment" 
          className={ readerSharedUI.icon }
        >
          <steppers.incrementIcon aria-hidden="true" focusable="false" /> 
        </Button>
      </Group>
    </NumberField>
  );
};