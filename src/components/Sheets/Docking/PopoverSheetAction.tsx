import { useCallback } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { ActionComponentVariant, IActionComponentTrigger } from "@/models/actions";
import { DockingKeys } from "@/models/docking";

import Stack from "../../assets/icons/stack.svg";

import { ActionIcon } from "@/components/Templates/ActionIcon";
import { OverflowMenuItem } from "@/components/Templates/OverflowMenuItem";

import { useActions } from "@/hooks/useActions";

import { useAppDispatch } from "@/lib/hooks";
import { dockAction } from "@/lib/actionsReducer";

export const PopoverSheetAction: React.FC<IActionComponentTrigger> = ({ variant, associatedKey }) => {
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
  
  return(
    <>
    { (variant && variant === ActionComponentVariant.menu) 
      ? <OverflowMenuItem 
          label={ Locale.reader.app.docker.popover.trigger }
          SVG={ Stack } 
          shortcut={ RSPrefs.docking.keys[DockingKeys.transient].shortcut }
          onActionCallback={ handlePress } 
          id={ `${ DockingKeys.transient }-${ associatedKey }` } 
          isDisabled={ isDisabled }
        />
      : <ActionIcon 
          className={ readerSharedUI.dockerButton }  
          ariaLabel={ Locale.reader.app.docker.popover.trigger }
          SVG={ Stack } 
          placement="bottom" 
          tooltipLabel={ Locale.reader.app.docker.popover.tooltip } 
          onPressCallback={ handlePress } 
          isDisabled={ isDisabled }
        />
    }
    </>
  )
}