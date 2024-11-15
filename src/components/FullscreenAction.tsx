import React from "react";

import Locale from "../resources/locales/en.json";
import { ActionKeys, RSPrefs } from "@/preferences";

import FullscreenCorners from "./assets/icons/fullscreen-corners-icon.svg";
import FullscreenExit from "./assets/icons/fullscreenExit-icon.svg";

import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ActionIcon } from "./Templates/ActionIcon";

import { useFullscreen } from "@/hooks/useFullscreen";
import { ActionComponentVariant, IActionComponent } from "./Templates/ActionComponent";

export const FullscreenAction: React.FC<IActionComponent> = ({ variant }) => {
  // Note: Not using React Aria ToggleButton here as fullscreen is quite
  // difficult to control in isolation due to collapsibility + shortcuts

  const fs = useFullscreen();

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
          onPressCallback={ fs.handleFullscreen }
        />
        : <></> 
      }
      </>
    )
  }
}