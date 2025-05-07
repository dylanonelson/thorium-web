"use client";

import React from "react";

export interface ThProgressionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ThProgression = ({ 
  children, 
  ...props
}: ThProgressionProps) => {
  return (
    <>
    <div { ...props }>
      { children }
    </div>
    </>
  )
}