"use client";

import { Input, InputProps, Label, LabelProps, Text, TextField, TextFieldProps } from "react-aria-components";

export interface ThFormTextFieldProps extends TextFieldProps {
  ref?: React.ForwardedRef<HTMLInputElement>;
  label: string;
  compounds?: {
    label?: LabelProps;
    input?: InputProps;
    description?: string;
  }
}

export const ThFormTextField = ({
  ref,
  label,
  children,
  compounds,
  ...props
}: ThFormTextFieldProps) => {
  return(
    <>
    <TextField
      ref={ ref }
      {...props}
    >
      { children 
        ? children 
        : <>
          <Label {...compounds?.label}>
            { label }
          </Label>
          <Input {...compounds?.input} />
          { compounds?.description && <Text slot="description"> { compounds?.description } </Text> }
          </> 
      }
    </TextField>
    </>
  )
}