import React, { useCallback, useEffect } from "react";

import Locale from "../resources/locales/en.json";

import FullscreenCorners from "./assets/icons/fullscreen-corners-icon.svg";
import FullscreenExit from "./assets/icons/fullscreenExit-icon.svg";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFullscreen } from "@/lib/readerReducer";
import { ActionComponent, ActionComponentVariant } from "./Templates/ActionComponent";
import { RSPrefs } from "@/preferences";

export const FullscreenAction = ({ variant }: { variant?: ActionComponentVariant }) => {
  const isFullscreen = useAppSelector(state => state.reader.isFullscreen);
  const dispatch = useAppDispatch();

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFSchange = () => {
      dispatch(setFullscreen(Boolean(document.fullscreenElement)));
    }

    document.addEventListener("fullscreenchange", onFSchange);

    return () => {
      document.removeEventListener("fullscreenchange", onFSchange);
    }
  }, []);

  return (
    <>
    { document.fullscreenEnabled 
    ? <ActionComponent 
        variant={ variant }
        label={ isFullscreen ? Locale.reader.fullscreen.close : Locale.reader.fullscreen.trigger }
        SVG={ isFullscreen ? FullscreenExit : FullscreenCorners } 
        placement="bottom" 
        tooltipLabel={ Locale.reader.fullscreen.tooltip } 
        shortcut={ RSPrefs.actions.fullscreen.shortcut }
        onActionCallback={ handleFullscreen }
        onPressCallback={ handleFullscreen }
      />
      : <></> 
    }
    </>
  )
}