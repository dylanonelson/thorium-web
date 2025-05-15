import { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { StatefulActionTriggerProps } from "@/models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { DockingKeys, ThLayoutDirection } from "@/preferences/models/enums";

import DockToLeft from "../../assets/icons/dock_to_right.svg";
import DocktoRight from "../../assets/icons/dock_to_left.svg";

import { ActionIcon } from "@/components/ActionTriggers/ActionIcon";
import { OverflowMenuItem } from "@/components/ActionTriggers/OverflowMenuItem";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { dockAction } from "@/lib/actionsReducer";
import { useActions } from "@/packages/Components/Actions/hooks/useActions";

export const DockEndAction = ({ variant, associatedKey }: StatefulActionTriggerProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const direction = useAppSelector(state => state.reader.direction);
  const actionsMap = useAppSelector(state => state.actions.keys);
  const isRTL = direction === ThLayoutDirection.rtl;
  const localeKey = isRTL ? Locale.reader.app.docker.dockToLeft : Locale.reader.app.docker.dockToRight;

  const actions = useActions(actionsMap);
  const isDisabled = actions.whichDocked(associatedKey) === DockingKeys.end;

  const dispatch = useAppDispatch();
  
  const handlePress = useCallback(() => {
    if (associatedKey) {
      dispatch(dockAction({
        key: associatedKey,
        dockingKey: DockingKeys.end
      }))
    }
  }, [dispatch, associatedKey]);
  
  return(
    <>
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <OverflowMenuItem 
          label={ localeKey.trigger }
          SVGIcon={ isRTL ? DockToLeft : DocktoRight } 
          shortcut={ RSPrefs.docking.keys[DockingKeys.end].shortcut }
          onAction={ handlePress } 
          id={ `${ DockingKeys.end }-${ associatedKey }` }
          isDisabled={ isDisabled }
        />
      : <ActionIcon 
          className={ readerSharedUI.dockerButton }  
          aria-label={ localeKey.trigger }
          placement="bottom" 
          tooltipLabel={ localeKey.tooltip } 
          onPress={ handlePress } 
          isDisabled={ isDisabled }
        >
          { isRTL 
            ? <DocktoRight aria-hidden="true" focusable="false" /> 
            : <DockToLeft aria-hidden="true" focusable="false" /> 
          }
        </ActionIcon>
    }
    </>
  )
}