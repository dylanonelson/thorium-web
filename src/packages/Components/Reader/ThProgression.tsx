"use client";

import React from "react";

export interface ThProgressionProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
}

export const ThProgression = ({ 
  ref,
  children, 
  ...props
}: ThProgressionProps) => {
  return (
    <>
    <div 
      ref={ ref } 
      {...props }
    >
      { children }
    </div>
    </>
  )
}