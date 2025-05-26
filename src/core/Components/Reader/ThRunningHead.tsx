"use client";

import React, { useEffect } from "react";

import { HTMLAttributesWithRef } from "../customTypes";

export interface ThRunningHeadProps extends HTMLAttributesWithRef<HTMLHeadingElement> {
  ref?: React.RefObject<HTMLHeadingElement>
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