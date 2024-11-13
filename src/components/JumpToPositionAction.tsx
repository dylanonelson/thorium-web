import React from "react";

import Locale from "../resources/locales/en.json";
import { ActionKeys, RSPrefs } from "@/preferences";

import TargetIcon from "./assets/icons/target-icon.svg";
import { ActionIcon } from "./Templates/ActionIcon";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";

export const JumpToPositionActionIcon = () => {
  return(
    <>
    <ActionIcon
      ariaLabel={ Locale.reader.jumpToPosition.trigger }
      SVG={ TargetIcon } 
      placement="bottom" 
      tooltipLabel={ Locale.reader.jumpToPosition.tooltip }
      onPressCallback={ () => {} }
    />
    </>
  )
}

export const JumpToPositionMenuItem = () => {
  return(
    <>
    <OverflowMenuItem 
      label={ Locale.reader.jumpToPosition.trigger }
      SVG={ TargetIcon }
      shortcut={ RSPrefs.actions.jumpToPosition.shortcut }
      id={ ActionKeys.jumpToPosition }
    />
    </>
  )
}