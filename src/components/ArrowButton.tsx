import React, { useEffect, useRef, useState } from "react";

import { IReaderArrow } from "@/models/layout";
import { StaticBreakpoints } from "@/models/staticBreakpoints";

import Locale from "../resources/locales/en.json";

import arrowStyles from "./assets/styles/arrowButton.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";
import readerStateStyles from "./assets/styles/readerStates.module.css";

import LeftArrow from "./assets/icons/arrow_back.svg";
import RightArrow from "./assets/icons/arrow_forward.svg";

import { Button, PressEvent, Tooltip, TooltipTrigger } from "react-aria-components";

import { usePrevious } from "@/hooks/usePrevious";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setArrows } from "@/lib/readerReducer";

import { isActiveElement } from "@/helpers/focus";
import classNames from "classnames";

export const ArrowButton = (props: IReaderArrow) => {
  const button = useRef<HTMLButtonElement>(null);
  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);
  const isRTL = useAppSelector(state => state.publication.isRTL);
  const hasArrows = useAppSelector(state => state.reader.hasArrows);

  const isPaged = useAppSelector(state => state.reader.isPaged);
  const wasPaged = usePrevious(isPaged);

  const dispatch = useAppDispatch();

  const [isHovering, setIsHovering] = useState(false);

  const switchedFromScrollable = () => {
    return isPaged && isPaged !== wasPaged;
  }

  const label = (
    props.direction === "right" && !isRTL || 
    props.direction === "left" && isRTL
  ) 
    ? Locale.reader.navigation.goForward 
    : Locale.reader.navigation.goBackward;

  const handleClassNameFromState = () => {
    let className = "";
    if (!hasArrows && !switchedFromScrollable()) {
      className = readerStateStyles.immersiveHidden;
    }
    return className;
  };

  const handleClassNameFromBreakpoint = () => {
    let className = "";
    if (
      staticBreakpoint === StaticBreakpoints.large || 
      staticBreakpoint === StaticBreakpoints.xLarge
    ) {
      className = arrowStyles.viewportLarge;
    }
    return className;
  };

  useEffect(() => {
    if ((props.disabled || (!hasArrows && !isHovering)) && isActiveElement(button.current)) {
      button.current!.blur();
    }
  });

  const blurOnEsc = (event: React.KeyboardEvent) => {    
    if (isActiveElement(button.current) && event.code === "Escape") {
      button.current!.blur();
    }
  };

  // Unlike preventFocusOnPress, this gives a visual feedback
  // the button has been pressed in immersive mode (esp. when hidden)
  // CSS needs to take care of hover state though, as it will be applied
  // on mobile depending on the length of the press
  const handleNonKeyboardFocus = (event: PressEvent) => {
    if (event.pointerType !== "keyboard") {
      if (isActiveElement(button.current)) {
        button.current!.blur()
      }
    }
  }

  const handleOnPress = (cb: () => void) => {
    dispatch(setArrows(false));
    cb();
  }
  
  return (
    <>
    <TooltipTrigger>
      <Button
        ref={ button }
        aria-label={ label }
        onPress={ () => handleOnPress(props.onPressCallback) }
        onPressEnd={ handleNonKeyboardFocus }
        onHoverChange={ (e) => setIsHovering(e) } 
        onKeyDown={ blurOnEsc }
        className={ classNames(props.className, handleClassNameFromBreakpoint(), handleClassNameFromState()) }
        isDisabled={ props.disabled }
      >
        { props.direction === "left" ? 
          <LeftArrow aria-hidden="true" focusable="false" /> : 
          <RightArrow aria-hidden="true" focusable="false" />
        }
      </Button>
      <Tooltip
        className={ readerSharedUI.tooltip }
        placement={ props.direction === "left" ? "right" : "left" }>
        { label }
      </Tooltip>
    </TooltipTrigger>
    </>);
}