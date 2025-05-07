"use client";

import React, { ThHTMLAttributes, useEffect } from "react";

export interface ThRunningHeadProps extends ThHTMLAttributes<HTMLHeadingElement> {
  ref?: React.Ref<HTMLHeadingElement>
  label: string;
  syncDocTitle?: boolean;  
}

export const ThRunningHead = ({ 
  ref,
  label,
  syncDocTitle,
  ...props
}: ThRunningHeadProps) => {

  useEffect(() => {
    if (syncDocTitle && label) document.title = label;
  }, [syncDocTitle, label])

  return(
    <>
    <h1 
      ref={ ref }
      { ...props }
    >
        { label }
      </h1>
    </>
  )
}