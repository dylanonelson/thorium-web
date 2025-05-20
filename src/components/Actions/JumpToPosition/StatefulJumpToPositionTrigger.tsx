"use client";

import React, { useContext } from "react";

import { PreferencesContext } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import { ThActionsKeys } from "@/preferences/models/enums";
import { StatefulActionTriggerProps } from "../models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";

import TargetIcon from "./assets/icons/point_scan.svg";

import { StatefulActionIcon } from "../Triggers/StatefulActionIcon";
import { StatefulOverflowMenuItem } from "../Triggers/StatefulOverflowMenuItem";

export const StatefulJumpToPosition = ({ variant }: StatefulActionTriggerProps) => {
  const RSPrefs = useContext(PreferencesContext);

  return (<></>);
  
  /*
  return(
    <>
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ Locale.reader.jumpToPosition.trigger }
          SVGIcon={ TargetIcon }
          shortcut={ RSPrefs.actions.keys[ThActionsKeys.jumpToPosition].shortcut }
          id={ ThActionsKeys.jumpToPosition }
          onAction={ () => {} }
        />
      : <StatefulActionIcon
          visibility={ RSPrefs.actions.keys[ThActionsKeys.jumpToPosition].visibility } 
          aria-label={ Locale.reader.jumpToPosition.trigger }
          placement="bottom" 
          tooltipLabel={ Locale.reader.jumpToPosition.tooltip }
          onPress={ () => {} }
        >
          <TargetIcon aria-hidden="true" focusable="false" />
        </StatefulActionIcon>
    }
    </>
  )
    */
}