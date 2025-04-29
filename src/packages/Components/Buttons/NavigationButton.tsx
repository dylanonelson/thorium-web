import React from "react";

import ArrowBack from "./assets/icons/arrow_back.svg";
import ArrowForward from "./assets/icons/arrow_forward.svg";

import { LayoutDirection } from "@/models/layout";

import { ActionButton, NavigationButtonProps } from "./ActionButton";

export const NavigationButton = ({
  direction,
  label,
  ref,
  tooltip,
  ...props
}: NavigationButtonProps) => {
  const children = props.children;

  const fallBackChildren = (
    <React.Fragment>
      { direction === LayoutDirection.rtl
        ? <ArrowForward aria-hidden="true" focusable="false" />
        : <ArrowBack aria-hidden="true" focusable="false" />
      }
      { label }
    </React.Fragment>
  );

  return (
    <ActionButton
      ref={ ref }
      tooltip={ tooltip }
      { ...props }
    >
      { children || fallBackChildren }
    </ActionButton>
  )
}
