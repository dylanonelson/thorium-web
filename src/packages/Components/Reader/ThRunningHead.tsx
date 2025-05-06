"use client";

import React, { ThHTMLAttributes, useEffect } from "react";

export interface ThRunningHeadProps extends ThHTMLAttributes<HTMLHeadingElement> {
  label: string;
  syncDocTitle?: boolean;  
}

export const ThRunningHead = ({ 
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
      { ...props }
    >
        { label }
      </h1>
    </>
  )
}