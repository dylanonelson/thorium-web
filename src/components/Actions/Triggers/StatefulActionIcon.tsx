import React, { useContext, useRef } from "react";

import { PreferencesContext } from "@/preferences";

import { TooltipProps } from "react-aria-components";
import { CollapsibilityVisibility } from "@/packages/Components/Actions/hooks/useCollapsibility";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";
import readerStateStyles from "../../assets/styles/readerStates.module.css";

import { ThActionButton, ThActionButtonProps } from "@/packages/Components/Buttons/ThActionButton";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setImmersive } from "@/lib/readerReducer";

import { isActiveElement, isKeyboardTriggered } from "@/packages/Helpers/focusUtilities";

import classNames from "classnames";

export interface StatefulActionIconProps extends ThActionButtonProps {
  visibility?: CollapsibilityVisibility;
  placement?: TooltipProps["placement"];
  tooltipLabel?: string;
}

export const StatefulActionIcon = ({
 visibility,
 placement,
 tooltipLabel,
  ...props
}: StatefulActionIconProps) => {
  const children = props.children;
  const RSPrefs = useContext(PreferencesContext);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);

  const dispatch = useAppDispatch();

  const handleClassNameFromState = () => {
    let className = "";
    
    switch(visibility) {
      case CollapsibilityVisibility.always:
        if (!isHovering && isImmersive) {
          className = readerStateStyles.subduedAlways;
        } else {
          className = visibility;
        }
        break;
      case CollapsibilityVisibility.partially:
        if (!isHovering && isImmersive) {
          className = readerStateStyles.subduedPartially;
        } else {
          className = visibility;
        }
        break;
      case CollapsibilityVisibility.overflow:
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
      tooltip={ tooltipLabel ? {
        trigger: {
          delay: RSPrefs.theming.icon.tooltipDelay,
          closeDelay: RSPrefs.theming.icon.tooltipDelay
        },
        tooltip: {
          className: readerSharedUI.tooltip,
          placement: placement,
          offset: RSPrefs.theming.icon.tooltipOffset || 0
        },
        label: tooltipLabel
      } : undefined }
      { ...Object.fromEntries(Object.entries(props).filter(([key]) => key !== "className")) }
    >
      { children }
    </ThActionButton>
  )
};