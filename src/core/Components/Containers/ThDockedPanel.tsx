"use client";

import React from "react";
import { createPortal } from "react-dom";

import { ThContainerProps } from "./ThContainer";

import { FocusScope, useObjectRef } from "react-aria";
import { useFirstFocusable } from "./hooks/useFirstFocusable";

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
        autoFocus={ (focusOptions?.action?.type && focusOptions.action.type === "focus") ?? false } 
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