import React, { useContext, useEffect, useRef, useState } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../resources/locales/en.json";

import arrowStyles from "./assets/styles/arrowButton.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";
import readerStateStyles from "./assets/styles/readerStates.module.css";

import { PressEvent } from "react-aria";

import { ThNavigationButton, ThNavigationButtonProps } from "@/packages/Components/Buttons/ThNavigationButton";

import { usePrevious } from "@/packages/Hooks/usePrevious";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setArrows } from "@/lib/readerReducer";

import { isActiveElement } from "@/packages/Helpers/focusUtilities";

import classNames from "classnames";

export interface ReaderArrowProps extends ThNavigationButtonProps {
  direction: "left" | "right";
  occupySpace: boolean;
}

export const ArrowButton = ({
  direction,
  occupySpace,
  className,
  isDisabled,
  onPress,
  ...props
}: ReaderArrowProps) => {
  const RSPrefs = useContext(PreferencesContext);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isRTL = useAppSelector(state => state.publication.isRTL);
  const hasArrows = useAppSelector(state => state.reader.hasArrows);

  const isScroll = useAppSelector(state => state.settings.scroll);
  const wasScroll = usePrevious(isScroll);

  const dispatch = useAppDispatch();

  const [isHovering, setIsHovering] = useState(false);

  const switchedFromScrollable = () => {
    return wasScroll && !isScroll;
  }

  const label = (
    direction === "right" && !isRTL || 
    direction === "left" && isRTL
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

  const handleClassNameFromSpaceProp = () => {
    let className = "";
    if (occupySpace) {
      className = arrowStyles.viewportLarge;
    }
    return className;
  };

  useEffect(() => {
    if ((isDisabled || (!hasArrows && !isHovering)) && isActiveElement(buttonRef.current)) {
      buttonRef.current!.blur();
    }
  });

  const blurOnEsc = (event: React.KeyboardEvent) => {    
    if (isActiveElement(buttonRef.current) && event.code === "Escape") {
      buttonRef.current!.blur();
    }
  };

  const handleOnPress = (e: PressEvent, cb: (e: PressEvent) => void) => {
    dispatch(setArrows(false));
    cb(e);
  }

  return (
    <>
    <ThNavigationButton 
      direction={ direction }
      ref= { buttonRef }
      aria-label={ label }
      onPress={ (e) => onPress && handleOnPress(e, onPress) }
      onHoverChange={ (e) => setIsHovering(e) } 
      onKeyDown={ blurOnEsc }
      className={ classNames(className, handleClassNameFromSpaceProp(), handleClassNameFromState()) }
      isDisabled={ isDisabled }
      preventFocusOnPress={ true }
      { ...props }
      tooltip={ {
        trigger: {
          delay: RSPrefs.theming.arrow.tooltipDelay,
          closeDelay: RSPrefs.theming.arrow.tooltipDelay
        },
        tooltip: {
          placement: direction === "left" ? "right" : "left",
          className: readerSharedUI.tooltip
        },
        label: label
      } }
    />
    </>
  )
}