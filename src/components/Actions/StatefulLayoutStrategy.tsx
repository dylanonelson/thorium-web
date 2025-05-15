import { useContext } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import LayoutIcon from "./assets/icons/fit_page_width.svg";

import { ThActionsKeys } from "@/preferences/models/enums";
import { StatefulActionContainerProps, StatefulActionTriggerProps } from "@/models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import { StatefulActionIcon } from "./Triggers/StatefulActionIcon";
import { StatefulOverflowMenuItem } from "./Triggers/StatefulOverflowMenuItem";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";
import { setHovering } from "@/lib/readerReducer";

import { useDocking } from "../Docking/hooks/useDocking";
import { SheetWithType } from "../Sheets/SheetWithType";
import { ReadingDisplayLayoutStrategy } from "../Settings/ReadingDisplayLayoutStrategy";

export const StatefulLayoutStrategyContainer = ({ triggerRef }: StatefulActionContainerProps) => {
  const actionState = useAppSelector(state => state.actions.keys[ThActionsKeys.layoutStrategy]);
  const dispatch = useAppDispatch();
  
  const docking = useDocking(ThActionsKeys.layoutStrategy);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ThActionsKeys.layoutStrategy,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  return(
    <>
    <SheetWithType 
      sheetType={ sheetType }
      sheetProps={ {
        id: ThActionsKeys.layoutStrategy,
        triggerRef: triggerRef,
        heading: Locale.reader.layoutStrategy.heading,
        className: settingsStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState.isOpen || false,
        onOpenChange: setOpen, 
        onPressClose: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      <ReadingDisplayLayoutStrategy />
    </SheetWithType>
    </>
  )
}

export const StatefulLayoutStrategyTrigger = ({ variant }: StatefulActionTriggerProps) => {
  const RSPrefs = useContext(PreferencesContext);
  
  const actionState = useAppSelector(state => state.actions.keys[ThActionsKeys.layoutStrategy]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ThActionsKeys.layoutStrategy,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  return(
    <>
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ Locale.reader.layoutStrategy.trigger }
          SVGIcon={ LayoutIcon }
          shortcut={ RSPrefs.actions.keys[ThActionsKeys.layoutStrategy].shortcut } 
          id={ ThActionsKeys.layoutStrategy }
          onAction={ () => setOpen(!actionState.isOpen) }
        />
      : <StatefulActionIcon 
          visibility={ RSPrefs.actions.keys[ThActionsKeys.layoutStrategy].visibility }
          aria-label={ Locale.reader.layoutStrategy.trigger }
          placement="bottom" 
          tooltipLabel={ Locale.reader.layoutStrategy.tooltip } 
          onPress={ () => setOpen(!actionState.isOpen) }
        >
          <LayoutIcon aria-hidden="true" focusable="false" />
        </StatefulActionIcon>
    }
    </>
  )
}