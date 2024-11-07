import React, { useEffect } from "react";

import Locale from "../resources/locales/en.json";

import FullscreenCorners from "./assets/icons/fullscreen-corners-icon.svg";
import FullscreenExit from "./assets/icons/fullscreenExit-icon.svg";
import fullscreenStyles from "./assets/styles/fullscreen.module.css";

import { ActionIcon } from "./ActionIcon";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFullscreen } from "@/lib/readerReducer";

export const Fullscreen = () => {
  const isFullscreen = useAppSelector(state => state.reader.isFullscreen);
  const dispatch = useAppDispatch();

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      dispatch(setFullscreen(true));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      dispatch(setFullscreen(false));
    }
  }

  useEffect(() => {    
    document.addEventListener("fullscreenchange", handleFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
    }
  }, []);

  return (
    <>
    <ActionIcon 
      className={ fullscreenStyles.fullscreenButton } 
      ariaLabel={ isFullscreen ? Locale.reader.fullscreen.exit : Locale.reader.fullscreen.request } 
      SVG={ isFullscreen ? FullscreenExit : FullscreenCorners } 
      placement="bottom" 
      tooltipLabel={ Locale.reader.app.actions.fullscreen } 
      onPressCallback={ handleFullscreen }
    />
    </>
  )
}