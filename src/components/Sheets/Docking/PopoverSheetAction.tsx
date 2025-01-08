import { useCallback } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../../../resources/locales/en.json";

import readerSharedUI from "../../assets/styles/readerSharedUI.module.css";

import Stack from "../../assets/icons/stack.svg";

import { ActionComponentVariant, IActionComponent } from "@/components/Templates/ActionComponent";

import { ActionIcon } from "@/components/Templates/ActionIcon";
import { OverflowMenuItem } from "@/components/Templates/OverflowMenuItem";
import { DockingKeys } from "../Sheet";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLeftDock, setRightDock } from "@/lib/readerReducer";

export const PopoverSheetAction: React.FC<IActionComponent> = ({ variant, associatedKey }) => {
  const leftDock = useAppSelector(state => state.reader.leftDock);
  const rightDock = useAppSelector(state => state.reader.rightDock);
  const isStacked = (leftDock?.actionKey !== associatedKey && rightDock?.actionKey !== associatedKey);

  const dispatch = useAppDispatch();

  const handlePress = useCallback(() => {
    dispatch(setLeftDock(null));
    dispatch(setRightDock(null));
  }, [dispatch]);
  
  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
        label={ Locale.reader.app.docker.popover.trigger }
        SVG={ Stack } 
        shortcut={ RSPrefs.docking.keys[DockingKeys.floating].shortcut }
        onActionCallback={ handlePress } 
        id={ `${ DockingKeys.floating }-${ associatedKey }` } 
        isDisabled={ isStacked }
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
        isDisabled={ isStacked }
      />
      </>
    )
  }
}