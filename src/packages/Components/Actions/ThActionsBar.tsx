"use client";

import { useObjectRef } from "react-aria";
import { Toolbar, ToolbarProps } from "react-aria-components";

export interface ThActionsBarProps extends ToolbarProps {
  ref?: React.ForwardedRef<HTMLDivElement>
};

export const ThActionsBar = ({ 
  ref, 
  children, 
  ...props 
}: ThActionsBarProps) => {
  const resolvedRef = useObjectRef(ref);

  return (
    <Toolbar 
      ref={ resolvedRef } 
      { ...props }
    >
      { children }
    </Toolbar>
  )
}