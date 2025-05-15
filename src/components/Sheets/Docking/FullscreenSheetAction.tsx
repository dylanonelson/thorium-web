import { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { StatefulActionTriggerProps } from "@/models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { ThDockingKeys } from "@/preferences/models/enums";

import Dialog from "../../assets/icons/dialogs.svg";

import { ActionIcon } from "@/components/ActionTriggers/ActionIcon";
import { OverflowMenuItem } from "@/components/ActionTriggers/OverflowMenuItem";

import { useActions } from "@/packages/Components/Actions/hooks/useActions";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { dockAction } from "@/lib/actionsReducer";

export const FullscreenSheetAction = ({ variant, associatedKey }: StatefulActionTriggerProps) => {
  const RSPrefs = useContext(PreferencesContext);
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
      ? <OverflowMenuItem 
          label={ Locale.reader.app.docker.fullscreen.trigger }
          SVGIcon={ Dialog } 
          shortcut={ RSPrefs.docking.keys[ThDockingKeys.transient].shortcut }
          onAction={ handlePress } 
          id={ `${ ThDockingKeys.transient }-${ associatedKey }` } 
          isDisabled={ isDisabled }
        />
      : <ActionIcon 
          className={ readerSharedUI.dockerButton }  
          aria-label={ Locale.reader.app.docker.fullscreen.trigger }
          placement="bottom" 
          tooltipLabel={ Locale.reader.app.docker.fullscreen.tooltip } 
          onPress={ handlePress } 
          isDisabled={ isDisabled }
        >
          <Dialog aria-hidden="true" focusable="false" />
        </ActionIcon>
    }
    </>
  )
}