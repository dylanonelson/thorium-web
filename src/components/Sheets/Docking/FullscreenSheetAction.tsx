import { useCallback } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { ActionComponentVariant, IActionComponent } from "@/models/actions";
import { DockingKeys } from "@/models/docking";

import Dialog from "../../assets/icons/dialogs.svg";

import { ActionIcon } from "@/components/Templates/ActionIcon";
import { OverflowMenuItem } from "@/components/Templates/OverflowMenuItem";

import { useActions } from "@/hooks/useActions";

import { useAppDispatch } from "@/lib/hooks";
import { dockAction } from "@/lib/actionsReducer";

export const FullscreenSheetAction: React.FC<IActionComponent> = ({ variant, associatedKey }) => {
  const actions = useActions();
  const isDisabled = !actions.isDocked(associatedKey);
  
  const dispatch = useAppDispatch();
    
  const handlePress = useCallback(() => {
    if (associatedKey) {
      dispatch(dockAction({
        key: associatedKey,
        dockingKey: DockingKeys.transient
      }))
    }
  }, [dispatch, associatedKey]);
  
  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
        label={ Locale.reader.app.docker.fullscreen.trigger }
        SVG={ Dialog } 
        shortcut={ RSPrefs.docking.keys[DockingKeys.transient].shortcut }
        onActionCallback={ handlePress } 
        id={ `${ DockingKeys.transient }-${ associatedKey }` } 
        isDisabled={ isDisabled }
      />
      </>
    )
  } else {
    return(
      <>
      <ActionIcon 
        className={ readerSharedUI.dockerButton }  
        ariaLabel={ Locale.reader.app.docker.fullscreen.trigger }
        SVG={ Dialog } 
        placement="bottom" 
        tooltipLabel={ Locale.reader.app.docker.fullscreen.tooltip } 
        onPressCallback={ handlePress } 
        isDisabled={ isDisabled }
      />
      </>
    )
  }
}