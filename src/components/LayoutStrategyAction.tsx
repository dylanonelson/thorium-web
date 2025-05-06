import { useContext } from "react";

import { PreferencesContext } from "@/preferences";

import Locale from "../resources/locales/en.json";

import LayoutIcon from "./assets/icons/fit_page_width.svg";

import { ActionKeys, IActionComponentContainer, IActionComponentTrigger } from "@/models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components";

import settingsStyles from "./assets/styles/readerSettings.module.css";

import { ActionIcon } from "./ActionTriggers/ActionIcon";
import { OverflowMenuItem } from "./ActionTriggers/OverflowMenuItem";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";
import { setHovering } from "@/lib/readerReducer";

import { useDocking } from "@/hooks/useDocking";
import { SheetWithType } from "./Sheets/SheetWithType";
import { ReadingDisplayLayoutStrategy } from "./Settings/ReadingDisplayLayoutStrategy";

export const LayoutStrategiesActionContainer: React.FC<IActionComponentContainer> = ({ triggerRef }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.layoutStrategy]);
  const dispatch = useAppDispatch();
  
  const docking = useDocking(ActionKeys.layoutStrategy);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ActionKeys.layoutStrategy,
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
        id: ActionKeys.layoutStrategy,
        triggerRef: triggerRef,
        heading: Locale.reader.layoutStrategy.heading,
        className: settingsStyles.readerSettings,
        placement: "bottom", 
        isOpen: actionState.isOpen || false,
        onOpenChangeCallback: setOpen, 
        onClosePressCallback: () => setOpen(false),
        docker: docking.getDocker()
      } }
    >
      <ReadingDisplayLayoutStrategy />
    </SheetWithType>
    </>
  )
}

export const LayoutStrategyAction: React.FC<IActionComponentTrigger> = ({ variant }) => {
  const RSPrefs = useContext(PreferencesContext);
  
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.layoutStrategy]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ActionKeys.layoutStrategy,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  return(
    <>
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <OverflowMenuItem 
          label={ Locale.reader.layoutStrategy.trigger }
          SVGIcon={ LayoutIcon }
          shortcut={ RSPrefs.actions.keys[ActionKeys.layoutStrategy].shortcut } 
          id={ ActionKeys.layoutStrategy }
          onAction={ () => setOpen(!actionState.isOpen) }
        />
      : <ActionIcon 
          visibility={ RSPrefs.actions.keys[ActionKeys.layoutStrategy].visibility }
          aria-label={ Locale.reader.layoutStrategy.trigger }
          placement="bottom" 
          tooltipLabel={ Locale.reader.layoutStrategy.tooltip } 
          onPress={ () => setOpen(!actionState.isOpen) }
        >
          <LayoutIcon aria-hidden="true" focusable="false" />
        </ActionIcon>
    }
    </>
  )
}