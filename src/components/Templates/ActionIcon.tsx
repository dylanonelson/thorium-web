import React, { ComponentType, SVGProps } from "react";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import readerStateStyles from "../assets/styles/readerStates.module.css";

import { Button, Tooltip, TooltipTrigger, TooltipProps, PressEvent, ButtonProps } from "react-aria-components";
import { ActionVisibility } from "@/preferences";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import classNames from "classnames";
import { setImmersive } from "@/lib/readerReducer";

export interface IActionIconProps {
  className?: string;
  ariaLabel: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  placement: TooltipProps["placement"];
  tooltipLabel: string;
  visibility: ActionVisibility;
  onPressCallback?: (e: PressEvent) => void;
}

export const ActionIcon: React.FC<Pick<ButtonProps, "preventFocusOnPress"> & IActionIconProps> = ({
  className,
  ariaLabel, 
  SVG,
  placement,
  tooltipLabel,
  visibility,
  onPressCallback,
  ...props
}) => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isFullscreen = useAppSelector(state => state.reader.isFullscreen);
  const overflowMenuOpen = useAppSelector(state => state.reader.overflowMenuOpen);
  const isHovering = useAppSelector(state => state.reader.isHovering);

  const dispatch = useAppDispatch();

  const handleClassNameFromState = () => {
    let className = "";
    
    const isSubdued = (isImmersive || isFullscreen);
    const isActive = (overflowMenuOpen || isHovering);
    
    switch(visibility) {
      case ActionVisibility.always:
        if (!isActive && isSubdued) {
          className = readerStateStyles.subduedAlways;
        } else {
          className = visibility;
        }
        break;
      case ActionVisibility.partially:
        if (!isActive && isSubdued) {
          className = readerStateStyles.subduedPartially;
        } else if (isActive) {
          className = readerStateStyles.subduedPartiallyHovering;
        } else {
          className = visibility;
        }
        break;
      case ActionVisibility.overflow:
      default:
        break;
    }

    return className
  };

  const defaultOnPressFunc = () => {
    dispatch(setImmersive(false));
  }
  
  return (
    <>
    <TooltipTrigger>
      <Button 
        className={ classNames(readerSharedUI.icon, handleClassNameFromState(), className) } 
        aria-label={ ariaLabel } 
        onPress={ onPressCallback || defaultOnPressFunc }
        { ...props }
      >
        <SVG aria-hidden="true" focusable="false" />
      </Button>
      <Tooltip
        className={ readerSharedUI.tooltip }
        placement={ placement } 
        offset={ 15 }
      >
        { tooltipLabel }
      </Tooltip>
    </TooltipTrigger>
    </>
  )
};