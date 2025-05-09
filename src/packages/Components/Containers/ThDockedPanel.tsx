"use client";

import React from "react";

import { ThContainerProps } from "./ThContainer";

import { Dialog, DialogProps, Popover, PopoverProps } from "react-aria-components";

import { FocusScope, useObjectRef } from "react-aria";
import { useFirstFocusable } from "./hooks";
import { createPortal } from "react-dom";

export interface ThDockedPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">, ThContainerProps {
  isOpen: boolean;
  portal: HTMLElement | null;
}

export const ThDockedPanel = ({ 
  ref,
  isOpen,
  portal,
  focusOptions,
  children, 
  ...props 
}: ThDockedPanelProps) => {
  const resolvedRef = useObjectRef(ref as React.RefObject<HTMLDivElement | null>);

  useFirstFocusable(focusOptions);

  return (
    <>
    { isOpen && portal && createPortal(
      <FocusScope 
        contain={ false }
        autoFocus={ true } 
        restoreFocus={ true }
      >
        <div
          ref={ resolvedRef } 
          { ...props }
        >
          { children }
        </div>
      </FocusScope>
      , portal)
    }
    </>
  )
}