import { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";
import Locale from "../../resources/locales/en.json";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { StatefulActionTriggerProps } from "@/models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { ThDockingKeys, ThLayoutDirection } from "@/preferences/models/enums";

import DockToLeft from "./assets/icons/dock_to_right.svg";
import DocktoRight from "./assets/icons/dock_to_left.svg";

import { StatefulActionIcon } from "../Actions/Triggers/StatefulActionIcon";
import { StatefulOverflowMenuItem } from "../Actions/Triggers/StatefulOverflowMenuItem";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { dockAction } from "@/lib/actionsReducer";
import { useActions } from "@/packages/Components/Actions/hooks/useActions";

export const StatefulDockStart = ({ variant, associatedKey }: StatefulActionTriggerProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const direction = useAppSelector(state => state.reader.direction);
  const actionsMap = useAppSelector(state => state.actions.keys);
  const isRTL = direction === ThLayoutDirection.rtl;
  const localeKey = isRTL ? Locale.reader.app.docker.dockToRight : Locale.reader.app.docker.dockToLeft;

  const actions = useActions(actionsMap);
  const isDisabled = actions.whichDocked(associatedKey) === ThDockingKeys.start;
  
  const dispatch = useAppDispatch();

  const handlePress = useCallback(() => {
    if (associatedKey) {
      dispatch(dockAction({
        key: associatedKey,
        dockingKey: ThDockingKeys.start
      }))
    }
  }, [dispatch, associatedKey]);
  
  return(
    <>
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ localeKey.trigger }
          SVGIcon={ isRTL ? DocktoRight : DockToLeft } 
          shortcut={ RSPrefs.docking.keys[ThDockingKeys.start].shortcut }
          onAction={ handlePress } 
          id={ `${ ThDockingKeys.start }-${ associatedKey }` }
          isDisabled={ isDisabled }
        />
      : <StatefulActionIcon 
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
        </StatefulActionIcon>
    }
    </>
  )
}