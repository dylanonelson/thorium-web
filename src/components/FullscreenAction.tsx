import React from "react";

import Locale from "../resources/locales/en.json";
import { RSPrefs } from "@/preferences";

import FullscreenCorners from "./assets/icons/fullscreen-corners-icon.svg";
import FullscreenExit from "./assets/icons/fullscreenExit-icon.svg";

import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ActionIcon } from "./Templates/ActionIcon";

import { useFullscreen } from "@/hooks/useFullscreen";
import { OverflowMenuKeys } from "./OverflowMenu";

export const FullscreenActionIcon = () => {
  const fs = useFullscreen();

  return(
    <>
    { document.fullscreenEnabled 
    ? <ActionIcon 
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

export const FullscreenMenuItem = () => {
  const fs = useFullscreen();

  return(
    <>
    { document.fullscreenEnabled 
    ? <OverflowMenuItem 
        label={ Locale.reader.fullscreen.trigger }
        SVG={ FullscreenCorners } 
        shortcut={ RSPrefs.actions.fullscreen.shortcut }
        onActionCallback={ fs.handleFullscreen } 
        id={ OverflowMenuKeys.fullscreen }
      />
    : <></>
    }
    </>
  )
}