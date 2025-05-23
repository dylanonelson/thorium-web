"use client";

import { HTMLAttributesWithRef } from "../HTMLAttributesWithRef";

export const ThFooter = ({ 
  ref,
  children,
  ...props 
}: HTMLAttributesWithRef<HTMLDivElement>) => {
  return (
    <aside 
      ref={ ref } 
      { ...props }
    >
      { children }
    </aside>
  )
}