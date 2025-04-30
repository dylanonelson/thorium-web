import React from "react";

import ArrowBack from "./assets/icons/arrow_back.svg";
import ArrowForward from "./assets/icons/arrow_forward.svg";

import { ActionButton, ActionButtonProps } from "./ActionButton";

export interface NavigationButtonProps extends ActionButtonProps {
  direction?: "left" | "right";
}

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
      { direction === "right"
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
