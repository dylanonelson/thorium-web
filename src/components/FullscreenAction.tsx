import React from "react";

import Locale from "../resources/locales/en.json";
import { RSPrefs } from "@/preferences";

import FullscreenCorners from "./assets/icons/fullscreen.svg";
import FullscreenExit from "./assets/icons/fullscreen_exit.svg";

import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ActionIcon } from "./Templates/ActionIcon";

import { useFullscreen } from "@/hooks/useFullscreen";
import { ActionComponentVariant, ActionKeys, IActionComponent } from "./Templates/ActionComponent";

import { useAppDispatch } from "@/lib/hooks";
import { setHovering } from "@/lib/readerReducer";

export const FullscreenAction: React.FC<IActionComponent> = ({ variant }) => {
  // Note: Not using React Aria ToggleButton here as fullscreen is quite
  // difficult to control in isolation due to collapsibility + shortcuts

  const fs = useFullscreen();
  const dispatch = useAppDispatch();

  const handlePress = () => {
    fs.handleFullscreen();
    // Has to be dispatched manually, otherwise stays true… 
    dispatch(setHovering(false));
    // TODO: fix hover state on exit, if even possible w/o a lot of getting around…
  };

  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      { document.fullscreenEnabled 
      ? <OverflowMenuItem 
          label={ Locale.reader.fullscreen.trigger }
          SVG={ FullscreenCorners } 
          shortcut={ RSPrefs.actions.fullscreen.shortcut }
          onActionCallback={ fs.handleFullscreen } 
          id={ ActionKeys.fullscreen }
        />
      : <></>
      }
      </>
    )
  } else {
    return(
      <>
      { document.fullscreenEnabled 
      ? <ActionIcon 
          visibility={ RSPrefs.actions[ActionKeys.fullscreen].visibility }  
          ariaLabel={ fs.isFullscreen ? Locale.reader.fullscreen.close : Locale.reader.fullscreen.trigger }
          SVG={ fs.isFullscreen ? FullscreenExit : FullscreenCorners } 
          placement="bottom" 
          tooltipLabel={ Locale.reader.fullscreen.tooltip } 
          onPressCallback={ handlePress } 
        />
        : <></> 
      }
      </>
    )
  }
}