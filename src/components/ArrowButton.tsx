import React, { useEffect, useRef } from "react";

import Locale from "../resources/locales/en.json";
import arrowStyles from "./assets/styles/arrowButton.module.css";

import LeftArrow from "./assets/icons/baseline-arrow_left_ios-24px.svg";
import RightArrow from "./assets/icons/baseline-arrow_forward_ios-24px.svg";

import { control } from "../helpers/control";
import { Button, Tooltip, TooltipTrigger } from "react-aria-components";

export interface ReaderArrowProps {
  direction: "left" | "right";
  isRTL: boolean;
  className: string;
  disabled: boolean;
}

export const ArrowButton = (props: ReaderArrowProps) => {
  const button = useRef<HTMLButtonElement>(null);

  const label = (props.direction === "right" || props.isRTL) ? Locale.reader.navigation.goForward : Locale.reader.navigation.goBackward;

  useEffect(() => {
    if (props.disabled && document.activeElement === button.current) {
      button.current!.blur()
    }
  })
  
  return (
    <>
      <TooltipTrigger>
        <Button
          ref={button}
          aria-label={label}
          onPress={() => { props.direction === "left" ? control("goLeft") : control("goRight") }}
          className={props.className}
          isDisabled={props.disabled}>
          {props.direction === "left" ? <LeftArrow aria-hidden="true" focusable="false" /> : <RightArrow aria-hidden="true" focusable="false" />}
        </Button>
        <Tooltip
          className={arrowStyles.arrowTooltip}
          placement={props.direction === "left" ? "right" : "left"}>
          {label}
        </Tooltip>
      </TooltipTrigger>
    </>);
}