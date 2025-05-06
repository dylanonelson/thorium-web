"use client";

import { ThHTMLAttributes } from "./ThHTMLAttributes";

export const ThHeader = ({ 
  ref,
  children,
  ...props 
}: ThHTMLAttributes<HTMLDivElement>) => {
  return (
    <header 
      ref={ ref } 
      { ...props }
    >
      { children }
    </header>
  )
}