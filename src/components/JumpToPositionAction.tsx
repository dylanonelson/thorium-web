import React from "react";

import Locale from "../resources/locales/en.json";

import TargetIcon from "./assets/icons/target-icon.svg";

import { RSPrefs } from "@/preferences";
import { ActionComponent, ActionComponentVariant } from "./Templates/ActionComponent";

export const JumpToPositionAction = ({ variant }: { variant?: ActionComponentVariant }) => {
  return(
    <>
    <ActionComponent 
      variant={ variant } 
      label={ Locale.reader.jumpToPosition.trigger }
      SVG={ TargetIcon } 
      tooltipLabel={ Locale.reader.jumpToPosition.tooltip }
      shortcut={ RSPrefs.actions.jumpToPosition.shortcut } 
      onActionCallback={ () => {} }
    />
    </>
  )
}