import { useCallback } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { ActionComponentVariant, IActionComponent } from "@/models/actions";
import { DockingKeys } from "@/models/docking";

import Stack from "../../assets/icons/stack.svg";

import { ActionIcon } from "@/components/Templates/ActionIcon";
import { OverflowMenuItem } from "@/components/Templates/OverflowMenuItem";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { dockAction } from "@/lib/actionsReducer";

export const PopoverSheetAction: React.FC<IActionComponent> = ({ variant, associatedKey }) => {
  const dockingStart = useAppSelector(state => state.actions.dock[DockingKeys.start]);
  const dockingEnd = useAppSelector(state => state.actions.dock[DockingKeys.end])
  const isDisabled = (dockingStart.actionKey === associatedKey) && (dockingEnd.actionKey === associatedKey);
    
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
        label={ Locale.reader.app.docker.popover.trigger }
        SVG={ Stack } 
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
        ariaLabel={ Locale.reader.app.docker.popover.trigger }
        SVG={ Stack } 
        placement="bottom" 
        tooltipLabel={ Locale.reader.app.docker.popover.tooltip } 
        onPressCallback={ handlePress } 
        isDisabled={ isDisabled }
      />
      </>
    )
  }
}