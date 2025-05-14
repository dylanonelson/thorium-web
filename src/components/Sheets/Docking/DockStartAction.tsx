import { useCallback, useContext } from "react";

import { PreferencesContext } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import { IActionComponentTrigger } from "@/models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { DockingKeys, ThLayoutDirection } from "@/preferences/models/enums";

import DockToLeft from "../../assets/icons/dock_to_right.svg";
import DocktoRight from "../../assets/icons/dock_to_left.svg";

import { ActionIcon } from "@/components/ActionTriggers/ActionIcon";
import { OverflowMenuItem } from "@/components/ActionTriggers/OverflowMenuItem";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { dockAction } from "@/lib/actionsReducer";
import { useActions } from "@/packages/Components/Actions/hooks/useActions";

export const DockStartAction: React.FC<IActionComponentTrigger> = ({ variant, associatedKey }) => {
  const RSPrefs = useContext(PreferencesContext);
  const direction = useAppSelector(state => state.reader.direction);
  const actionsMap = useAppSelector(state => state.actions.keys);
  const isRTL = direction === ThLayoutDirection.rtl;
  const localeKey = isRTL ? Locale.reader.app.docker.dockToRight : Locale.reader.app.docker.dockToLeft;

  const actions = useActions(actionsMap);
  const isDisabled = actions.whichDocked(associatedKey) === DockingKeys.start;
  
  const dispatch = useAppDispatch();

  const handlePress = useCallback(() => {
    if (associatedKey) {
      dispatch(dockAction({
        key: associatedKey,
        dockingKey: DockingKeys.start
      }))
    }
  }, [dispatch, associatedKey]);
  
  return(
    <>
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <OverflowMenuItem 
          label={ localeKey.trigger }
          SVGIcon={ isRTL ? DocktoRight : DockToLeft } 
          shortcut={ RSPrefs.docking.keys[DockingKeys.start].shortcut }
          onAction={ handlePress } 
          id={ `${ DockingKeys.start }-${ associatedKey }` }
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