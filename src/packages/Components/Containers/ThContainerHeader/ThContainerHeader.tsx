"use client";

import { Heading, HeadingProps } from "react-aria-components";
import { HTMLAttributesWithRef } from "../../Reader/HTMLAttributesWithRef";

export interface ThContainerHeaderProps extends HTMLAttributesWithRef<HTMLDivElement> {
  ref?: React.ForwardedRef<HTMLDivElement>;
  label: string;
  compounds?: {
    heading?: HeadingProps;
  }
}

export const ThContainerHeader = ({ 
  ref,
  label,
  compounds,
  children,
  ...props 
}: ThContainerHeaderProps) => {
  return (
    <div 
      ref={ ref } 
      { ...props }
    >
      <Heading 
        slot="title"
        { ...compounds?.heading }
      >
        { label }
      </Heading>
      { children }
    </div>
  )
}