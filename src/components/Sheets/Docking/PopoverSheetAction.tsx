import { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { ActionComponentVariant, IActionComponentTrigger } from "@/models/actions";
import { DockingKeys } from "@/models/docking";

import Stack from "../../assets/icons/stack.svg";

import { ActionIcon } from "@/components/ActionTriggers/ActionIcon";
import { OverflowMenuItem } from "@/components/ActionTriggers/OverflowMenuItem";

import { useActions } from "@/hooks/useActions";

import { useAppDispatch } from "@/lib/hooks";
import { dockAction } from "@/lib/actionsReducer";

export const PopoverSheetAction: React.FC<IActionComponentTrigger> = ({ variant, associatedKey }) => {
  const RSPrefs = useContext(PreferencesContext);
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
          aria-label={ Locale.reader.app.docker.popover.trigger }
          placement="bottom" 
          tooltipLabel={ Locale.reader.app.docker.popover.tooltip } 
          onPress={ handlePress } 
          isDisabled={ isDisabled }
        >
          <Stack aria-hidden="true" focusable="false" />
        </ActionIcon>
    }
    </>
  )
}