import React from "react";

import LeftArrow from "./assets/icons/baseline-arrow_left_ios-24px.svg";
import RightArrow from "./assets/icons/baseline-arrow_forward_ios-24px.svg";
import { control } from "../helpers/control";
import Locale from "../resources/locales/en.json";
import { RSPrefs } from "@/preferences";

export interface ReaderArrowProps {
  direction: "left" | "right";
  isRTL: boolean;
  className: string;
  disabled: boolean;
}

export const ArrowButton = (props: ReaderArrowProps) => {
  let label = Locale.reader.navigation.moveBackward;
  if (props.direction === "right" || props.isRTL) {
    label = Locale.reader.navigation.moveForward
  }
  
  return (
    <>
     <button 
          title={label} 
          aria-label={label} 
          onClick={() => { props.direction === "left" ? control("goLeft") : control("goRight")} } 
          className={props.className} 
          style={RSPrefs.arrowSize ? {"--arrow-size": RSPrefs.arrowSize + "px"} : {}} 
          disabled={props.disabled}>
          {props.direction === "left" ? <LeftArrow aria-hidden="true" focusable="false"/> : <RightArrow aria-hidden="true" focusable="false"/>}
        </button>
    </>);
}