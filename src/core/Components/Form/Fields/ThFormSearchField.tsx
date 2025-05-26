"use client";

import React from "react";

import { WithRef } from "../../customTypes";

import { 
  FieldError, 
  FieldErrorProps, 
  Input, 
  InputProps, 
  Label, 
  LabelProps, 
  SearchField, 
  SearchFieldProps, 
  Text, 
  ValidationResult 
} from "react-aria-components";
import { ThActionButtonProps, ThCloseButton } from "../../Buttons";

export interface ThFormSearchFieldProps extends SearchFieldProps {
  ref?: React.ForwardedRef<HTMLInputElement>;
  label: string;
  compounds?: {
    label?: WithRef<LabelProps, HTMLLabelElement>;
    input?: WithRef<InputProps, HTMLInputElement>;
    button?: ThActionButtonProps | React.ReactElement<ThActionButtonProps>;
    description?: string;
    fieldError?: WithRef<FieldErrorProps, HTMLDivElement>;
  },
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const ThFormSearchField = ({
  ref,
  label,
  children,
  compounds,
  errorMessage,
  ...props
}: ThFormSearchFieldProps) => {
  return(
    <>
    <SearchField
      ref={ ref }
      {...props }
    >
      <>
      { children 
        ? children 
        : <>
          <Label { ...compounds?.label }>
            { label }
          </Label>
          { errorMessage && <FieldError { ...compounds?.fieldError }>{ errorMessage }</FieldError> }
          <Input { ...compounds?.input } />
          { compounds?.button && React.isValidElement(compounds.button) 
            ? compounds.button 
            : <ThCloseButton { ...compounds?.button } type="button" />
          }
          { compounds?.description && <Text slot="description"> { compounds?.description } </Text> }
          </> 
      }
      </>
    </SearchField>
    </>
  )
}