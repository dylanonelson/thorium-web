"use client";

import React from "react";

import { ThContainerProps } from "./ThContainer";

import { Dialog, DialogProps, Popover, PopoverProps } from "react-aria-components";

import { useObjectRef } from "react-aria";
import { useFirstFocusable } from "./hooks";

export interface ThPopoverProps extends Omit<PopoverProps, "children">, ThContainerProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  compounds?: {
    dialog: DialogProps
  }
}

export const ThPopover = ({ 
  ref,
  triggerRef,
  focusOptions,
  compounds,
  maxHeight,
  children, 
  ...props 
}: ThPopoverProps) => {
  const resolvedRef = useObjectRef(ref);

  useFirstFocusable(focusOptions);

  const computeMaxHeight = () => {
    if (!resolvedRef.current) return;
    return window.innerHeight - resolvedRef.current.offsetTop;
  };

  return (
    <Popover 
      ref={ resolvedRef }
      triggerRef={ triggerRef }
      maxHeight={ maxHeight || computeMaxHeight() }
      { ...props }
    >
      <Dialog { ...compounds?.dialog }>
        { children }
      </Dialog>
    </Popover>
  )
}