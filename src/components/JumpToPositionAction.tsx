import React, { useContext } from "react";

import { PreferencesContext } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionComponentVariant, ActionKeys, IActionComponentTrigger } from "@/models/actions";

import TargetIcon from "./assets/icons/point_scan.svg";

import { ActionIcon } from "./ActionTriggers/ActionIcon";
import { OverflowMenuItem } from "./ActionTriggers/OverflowMenuItem";

export const JumpToPositionAction: React.FC<IActionComponentTrigger> = ({ variant }) => {
  const RSPrefs = useContext(PreferencesContext);
  
  return(
    <>
    { (variant && variant === ActionComponentVariant.menu) 
      ? <OverflowMenuItem 
          label={ Locale.reader.jumpToPosition.trigger }
          SVGIcon={ TargetIcon }
          shortcut={ RSPrefs.actions.keys[ActionKeys.jumpToPosition].shortcut }
          id={ ActionKeys.jumpToPosition }
          onAction={ () => {} }
        />
      : <ActionIcon
          visibility={ RSPrefs.actions.keys[ActionKeys.jumpToPosition].visibility } 
          aria-label={ Locale.reader.jumpToPosition.trigger }
          placement="bottom" 
          tooltipLabel={ Locale.reader.jumpToPosition.tooltip }
          onPress={ () => {} }
        >
          <TargetIcon aria-hidden="true" focusable="false" />
        </ActionIcon>
    }
    </>
  )
}