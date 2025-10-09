"use client";

import React, { useRef } from "react";

import { TooltipProps } from "react-aria-components";
import { ThCollapsibilityVisibility } from "@/core/Components/Actions/hooks/useCollapsibility";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { ThActionButton, ThActionButtonProps } from "@/core/Components/Buttons/ThActionButton";

import { usePreferences } from "@/preferences/hooks/usePreferences";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setImmersive } from "@/lib/readerReducer";

import { isActiveElement, isKeyboardTriggered } from "@/core/Helpers/focusUtilities";

import classNames from "classnames";

export interface StatefulActionIconProps extends ThActionButtonProps {
  visibility?: ThCollapsibilityVisibility;
  placement?: TooltipProps["placement"];
  tooltipLabel?: string;
}

export const StatefulActionIcon = ({
 visibility,
 placement,
 tooltipLabel,
 children,
  ...props
}: StatefulActionIconProps) => {
  const { preferences } = usePreferences();

  const triggerRef = useRef<HTMLButtonElement>(null);

  const dispatch = useAppDispatch();

  const handleClassNameFromState = () => {
    let className = "";
    
    switch(visibility) {
      case ThCollapsibilityVisibility.always:
        className = readerSharedUI.alwaysVisible;
        break;
      case ThCollapsibilityVisibility.partially:
        className = readerSharedUI.partiallyVisible;
        break;
      case ThCollapsibilityVisibility.overflow:
      default:
        break;
    }

    return className
  };

  const defaultOnPressFunc = () => {
    dispatch(setImmersive(false));
  };

  const handleImmersive = (event: React.FocusEvent) => {
    // Check whether the focus was triggered by keyboard…
    // We don’t have access to type/modality, unlike onPress
    if (isKeyboardTriggered(event.target)) {
      dispatch(setImmersive(false));
    }
  };

  const blurOnEsc = (event: React.KeyboardEvent) => {
  // TODO: handle Tooltip cos first time you press esc, it’s the tooltip that is closed.
    if (triggerRef.current && isActiveElement(triggerRef.current) && event.code === "Escape") {
      triggerRef.current.blur();
    }
  };

  return (
    <ThActionButton
      ref={ triggerRef }
      className={ classNames(readerSharedUI.icon, handleClassNameFromState(), props.className) } 
      onPress={ props.onPress || defaultOnPressFunc }
      onKeyDown={ blurOnEsc } 
      onFocus={ handleImmersive }
      compounds={ tooltipLabel ? {
        tooltipTrigger: {
          delay: preferences.theming.icon.tooltipDelay,
          closeDelay: preferences.theming.icon.tooltipDelay
        },
        tooltip: {
          className: readerSharedUI.tooltip,
          placement: placement,
          offset: preferences.theming.icon.tooltipOffset || 0
        },
        label: tooltipLabel
      } : undefined }
      { ...Object.fromEntries(Object.entries(props).filter(([key]) => key !== "className")) }
    >
      { children }
    </ThActionButton>
  )
};