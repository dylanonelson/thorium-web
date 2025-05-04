import React from "react";

import { ComponentType, SVGProps } from "react";

import { Label, Radio, RadioGroup, RadioGroupProps } from "react-aria-components"

export interface RadioGroupItems {
  value: string;
  icon?: ComponentType<SVGProps<SVGElement>>;
  label: string;
  isDisabled?: boolean;
}

export interface ThRadioGroupProps extends RadioGroupProps {
  ref?: React.ForwardedRef<HTMLDivElement>;
  label?: string;
  items?: RadioGroupItems[];
  classNames?: {
    wrapper?: string;
    label?: string;
    radio?: string;
    radioLabel?: string;
  }
}

export const ThRadioGroup = ({
  ref,
  label,
  items,
  classNames,
  ...props
}: ThRadioGroupProps) => {
  if (React.isValidElement(props.children)) {
    return (
      <RadioGroup 
        ref={ ref }
        { ...props }
      >
        { label && <Label className={ classNames?.label }>
            { label }
          </Label> 
        }
        { props.children }
      </RadioGroup>
    )
  } else if (items) {
    return (
      <RadioGroup 
        { ...props }
      >
        { label && <Label className={ classNames?.label }>
            { label }
          </Label> 
        }
        <div className={ classNames?.wrapper}>
          { items.map((item, index) => (
            <Radio 
              key={ index }
              value={ item.value }
              className={ classNames?.radio }
            >
              { item.icon && <item.icon aria-hidden="true" focusable="false" /> }
              <span className={ classNames?.radioLabel }>
                { item.label }
              </span> 
            </Radio>
          )) }
        </div>
      </RadioGroup>
    )
  }
}