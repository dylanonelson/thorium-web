"use client";

import { Input, InputProps, Label, LabelProps, NumberField, NumberFieldProps, Text } from "react-aria-components";

export interface ThFormNumberFieldProps extends NumberFieldProps {
  ref?: React.ForwardedRef<HTMLInputElement>;
  label: string;
  compounds?: {
    label?: LabelProps;
    input?: InputProps;
    description?: string;
  }
}

export const ThFormNumberField = ({
  ref,
  label,
  compounds,
  children,
  ...props
}: ThFormNumberFieldProps) => {
  return(
    <>
    <NumberField
      ref={ ref }
      {...props}
    >
      { children 
        ? children 
        : <>
          <Label 
            {...compounds?.label}
          >
            { label }
          </Label>
          <Input {...compounds?.input} />
          { compounds?.description && <Text slot="description"> { compounds?.description } </Text> }
          </> 
      }
    </NumberField>
    </>
  )
}