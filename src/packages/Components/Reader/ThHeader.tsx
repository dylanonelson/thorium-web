"use client";

import { HTMLAttributesWithRef } from "./HTMLAttributesWithRef";

export const ThHeader = ({ 
  ref,
  children,
  ...props 
}: HTMLAttributesWithRef<HTMLDivElement>) => {
  return (
    <header 
      ref={ ref } 
      { ...props }
    >
      { children }
    </header>
  )
}