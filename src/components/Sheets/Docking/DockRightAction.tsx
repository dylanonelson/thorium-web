import { useCallback } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import DocktoRight from "../../assets/icons/dock_to_left.svg";

import { ActionComponentVariant, IActionComponent } from "@/components/Templates/ActionComponent";

import { ActionIcon } from "@/components/Templates/ActionIcon";
import { OverflowMenuItem } from "@/components/Templates/OverflowMenuItem";
import { DockingKeys } from "../Sheet";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLeftDock, setRightDock } from "@/lib/readerReducer";

export const DockRightAction: React.FC<IActionComponent> = ({ variant, associatedKey }) => {
  const rightDock = useAppSelector(state => state.reader.rightDock);
  
  const dispatch = useAppDispatch();

  const handlePress = useCallback(() => {
    dispatch(setLeftDock(null));
    dispatch(setRightDock({ 
      active: true,
      actionKey: associatedKey,
      width: RSPrefs.docking.dockedWidth 
    }));
  }, [dispatch, associatedKey]);
  
  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
        label={ Locale.reader.app.docker.dockToRight.trigger }
        SVG={ DocktoRight } 
        shortcut={ RSPrefs.docking.keys[DockingKeys.right].shortcut }
        onActionCallback={ handlePress } 
        id={ `${ DockingKeys.right }-${ associatedKey }` }
        isDisabled={ rightDock?.actionKey === associatedKey }
      />
      </>
    )
  } else {
    return(
      <>
      <ActionIcon 
        className={ readerSharedUI.dockerButton }  
        ariaLabel={ Locale.reader.app.docker.dockToRight.trigger }
        SVG={ DocktoRight } 
        placement="bottom" 
        tooltipLabel={ Locale.reader.app.docker.dockToRight.tooltip } 
        onPressCallback={ handlePress } 
        isDisabled={ rightDock?.actionKey === associatedKey }
      />
      </>
    )
  }
}