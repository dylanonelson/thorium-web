import React, { useContext, useEffect, useRef, useState } from "react";

import { IReaderArrow } from "@/models/layout";

import { PreferencesContext } from "@/preferences";

import Locale from "../resources/locales/en.json";

import arrowStyles from "./assets/styles/arrowButton.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";
import readerStateStyles from "./assets/styles/readerStates.module.css";

import { ThNavigationButton } from "@/packages/Components/Buttons/ThNavigationButton";

import { usePrevious } from "@/packages/Hooks/usePrevious";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setArrows } from "@/lib/readerReducer";

import { isActiveElement } from "@/packages/Helpers/focusUtilities";

import classNames from "classnames";

export const ArrowButton = (props: IReaderArrow) => {
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

  const handleClassNameFromSpaceProp = () => {
    let className = "";
    if (props.occupySpace) {
      className = arrowStyles.viewportLarge;
    }
    return className;
  };

  useEffect(() => {
    if ((props.disabled || (!hasArrows && !isHovering)) && isActiveElement(buttonRef.current)) {
      buttonRef.current!.blur();
    }
  });

  const blurOnEsc = (event: React.KeyboardEvent) => {    
    if (isActiveElement(buttonRef.current) && event.code === "Escape") {
      buttonRef.current!.blur();
    }
  };

  const handleOnPress = (cb: () => void) => {
    dispatch(setArrows(false));
    cb();
  }

  return (
    <>
    <ThNavigationButton 
      direction={ props.direction }
      ref= { buttonRef }
      aria-label={ label }
      onPress={ () => handleOnPress(props.onPressCallback) }
      onHoverChange={ (e) => setIsHovering(e) } 
      onKeyDown={ blurOnEsc }
      className={ classNames(props.className, handleClassNameFromSpaceProp(), handleClassNameFromState()) }
      isDisabled={ props.disabled }
      preventFocusOnPress={ true }
      tooltip={ {
        trigger: {
          delay: RSPrefs.theming.arrow.tooltipDelay,
          closeDelay: RSPrefs.theming.arrow.tooltipDelay
        },
        tooltip: {
          placement: props.direction === "left" ? "right" : "left",
          className: readerSharedUI.tooltip
        },
        label: label
      } }
    />
    </>
  )
}