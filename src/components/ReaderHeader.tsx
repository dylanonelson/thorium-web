import React from "react";

import Locale from "../resources/locales/en.json";
import readerStateStyles from "./assets/styles/readerStates.module.css";
import readerHeaderStyles from "./assets/styles/readerHeader.module.css";

import classNames from "classnames";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { SettingsAction } from "./SettingsAction";
import { FullscreenAction } from "./FullscreenAction";

export const ReaderHeader = ({ runningHead }: { runningHead: string | undefined }) => {
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const dispatch = useAppDispatch();

  const setHover = () => {
    dispatch(setHovering(true));
  };

  const removeHover = () => {
    dispatch(setHovering(false));
  };

  const handleClassNameFromState = () => {
    let className = "";
    if (isImmersive && isHovering) {
      className = readerStateStyles.immersiveHovering;
    } else if (isImmersive) {
      className = readerStateStyles.immersive;
    }
    return className
  };

  return (
    <>
    <header 
      className={ classNames(readerHeaderStyles.header, handleClassNameFromState()) } 
      id="top-bar" 
      aria-label={ Locale.reader.app.header.label } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
    >
      <h1 aria-label={ Locale.reader.app.header.runningHead }>
        { runningHead
          ? runningHead
          : Locale.reader.app.header.runningHeadFallback }
      </h1>
      <div className={ readerHeaderStyles.actionsWrapper }>
        <SettingsAction />
        <FullscreenAction />
      </div>
    </header>
    </>
  );
}