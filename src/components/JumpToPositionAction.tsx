import React from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionComponentVariant, ActionKeys, IActionComponent } from "@/models/actions";

import TargetIcon from "./assets/icons/point_scan.svg";

import { ActionIcon } from "./Templates/ActionIcon";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";

export const JumpToPositionAction: React.FC<IActionComponent> = ({ variant }) => {
  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
        label={ Locale.reader.jumpToPosition.trigger }
        SVG={ TargetIcon }
        shortcut={ RSPrefs.actions.keys[ActionKeys.jumpToPosition].shortcut }
        id={ ActionKeys.jumpToPosition }
      />
      </>
    )
  } else {
    return(
      <>
      <ActionIcon
        visibility={ RSPrefs.actions.keys[ActionKeys.jumpToPosition].visibility } 
        ariaLabel={ Locale.reader.jumpToPosition.trigger }
        SVG={ TargetIcon } 
        placement="bottom" 
        tooltipLabel={ Locale.reader.jumpToPosition.tooltip }
        onPressCallback={ () => {} }
      />
      </>
    )
  }
  
}