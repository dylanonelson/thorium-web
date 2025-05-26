"use client";

import React from "react";

import { Button, ButtonProps, Form, FormProps } from "react-aria-components";

export interface ThFormProps extends FormProps {
  ref?: React.ForwardedRef<HTMLFormElement>;
  label: string;
  compounds?: {
    button?: Exclude<ButtonProps, "type"> | React.ReactElement<ButtonProps>;
  }
}

export const ThForm = ({
  ref,
  label,
  compounds,
  children,
  ...props
}: ThFormProps) => {
  return(
    <>
    <Form
      ref={ ref }
      {...props}
    >
      { children }
    
      { compounds?.button && React.isValidElement(compounds.button) 
        ? compounds.button 
        : <Button
            { ...compounds?.button }
            type="submit"
          >
            { label }
          </Button>
      }
    </Form>
    </>
  )
}