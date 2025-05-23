"use client";

import Settings from "./assets/icons/settings.svg";

import { ThActionButton, ThActionButtonProps } from "../../Buttons/ThActionButton";

export const ThSettingsWrapperButton = ({
  label,
  ref,
  tooltip,
  children,
  ...props
}: ThActionButtonProps) => {
  return (
    <ThActionButton
      ref={ ref }
      tooltip={ tooltip }
      { ...props }
    >
      { children 
        ? children 
        : <>
          <Settings aria-hidden="true" focusable="false" /> 
          { label }
          </> 
      }
    </ThActionButton>
  )
}