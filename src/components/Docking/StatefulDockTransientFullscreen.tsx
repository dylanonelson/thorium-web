"use client";

import { useCallback } from "react";

import Locale from "../../resources/locales/en.json";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { StatefulActionTriggerProps } from "@/components/Actions/models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThActionsBar";
import { ThDockingKeys } from "@/preferences/models/enums";

import Dialog from "./assets/icons/dialogs.svg";

import { StatefulActionIcon } from "../Actions/Triggers/StatefulActionIcon";
import { StatefulOverflowMenuItem } from "../Actions/Triggers/StatefulOverflowMenuItem";

import { useActions } from "@/packages/Components/Actions/hooks/useActions";
import { usePreferences } from "@/preferences/ThPreferencesContext";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { dockAction } from "@/lib/actionsReducer";

export const StatefulDockTransientFullscreen = ({ variant, associatedKey }: StatefulActionTriggerProps) => {
  const RSPrefs = usePreferences();
  const actionsMap = useAppSelector(state => state.actions.keys);
  const actions = useActions(actionsMap);
  const isDisabled = !actions.isDocked(associatedKey) || actions.whichDocked(associatedKey) === ThDockingKeys.transient;
  
  const dispatch = useAppDispatch();
    
  const handlePress = useCallback(() => {
    if (associatedKey) {
      dispatch(dockAction({
        key: associatedKey,
        dockingKey: ThDockingKeys.transient
      }))
    }
  }, [dispatch, associatedKey]);
  
  return(
    <>
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ Locale.reader.app.docker.fullscreen.trigger }
          SVGIcon={ Dialog } 
          shortcut={ RSPrefs.docking.keys[ThDockingKeys.transient].shortcut }
          onAction={ handlePress } 
          id={ `${ ThDockingKeys.transient }-${ associatedKey }` } 
          isDisabled={ isDisabled }
        />
      : <StatefulActionIcon 
          className={ readerSharedUI.dockerButton }  
          aria-label={ Locale.reader.app.docker.fullscreen.trigger }
          placement="bottom" 
          tooltipLabel={ Locale.reader.app.docker.fullscreen.tooltip } 
          onPress={ handlePress } 
          isDisabled={ isDisabled }
        >
          <Dialog aria-hidden="true" focusable="false" />
        </StatefulActionIcon>
    }
    </>
  )
}