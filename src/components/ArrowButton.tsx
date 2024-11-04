import React, { useEffect, useRef, useState } from "react";

import Locale from "../resources/locales/en.json";
import { RSPrefs } from "@/preferences";

import arrowStyles from "./assets/styles/arrowButton.module.css";
import readerStateStyles from "./assets/styles/readerStates.module.css";

import LeftArrow from "./assets/icons/baseline-arrow_left_ios-24px.svg";
import RightArrow from "./assets/icons/baseline-arrow_forward_ios-24px.svg";

import { Button, Tooltip, TooltipTrigger } from "react-aria-components";

import { useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

export interface ReaderArrowProps {
  direction: "left" | "right";
  className?: string;
  disabled: boolean;
  onPressCallback: () => void;
}

export const ArrowButton = (props: ReaderArrowProps) => {
  const button = useRef<HTMLButtonElement>(null);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isFullscreen = useAppSelector(state => state.reader.isFullscreen);
  const hasReachedBreakpoint = useAppSelector(state => state.reader.hasReachedBreakpoint) || RSPrefs.breakpoint <= window.innerWidth;
  const isRTL = useAppSelector(state => state.publication.isRTL);

  const [isHovering, setIsHovering] = useState(false);

  const label = (props.direction === "right" && !isRTL || props.direction === "left" && isRTL) ? Locale.reader.navigation.goForward : Locale.reader.navigation.goBackward;

  const handleClassNameFromState = () => {
    let className = "";
    if (isImmersive && !hasReachedBreakpoint || isFullscreen) {
      className = readerStateStyles.immersiveHidden;
    } else if (isImmersive) {
      className = readerStateStyles.immersive;
    }
    return className
  }

  useEffect(() => {
    if ((props.disabled || (isImmersive && !isHovering)) && document.activeElement === button.current) {
      button.current!.blur()
    }
  })
  
  return (
    <>
    <TooltipTrigger>
      <Button
        ref={ button }
        aria-label={ label }
        onPress={ props.onPressCallback }
        onHoverChange={ (e) => setIsHovering(e) } 
        className={ classNames(props.className, handleClassNameFromState()) }
        isDisabled={ props.disabled }>
        { props.direction === "left" ? 
          <LeftArrow aria-hidden="true" focusable="false" /> : 
          <RightArrow aria-hidden="true" focusable="false" />
        }
      </Button>
      <Tooltip
        className={ arrowStyles.arrowTooltip }
        placement={ props.direction === "left" ? "right" : "left" }>
        { label }
      </Tooltip>
    </TooltipTrigger>
    </>);
}