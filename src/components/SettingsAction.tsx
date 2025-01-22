import React from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionComponentVariant, ActionKeys, IActionComponent } from "@/models/actions";

import settingsStyles from "./assets/styles/readerSettings.module.css";

import TuneIcon from "./assets/icons/match_case.svg";

import { SheetWithType } from "./Sheets/SheetWithType";
import { ActionIcon } from "./Templates/ActionIcon";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";
import { ReadingDisplayTheme } from "./ReadingDisplayTheme";

import { useDocking } from "@/hooks/useDocking";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

export const SettingsAction: React.FC<IActionComponent> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.settings]);
  const dispatch = useAppDispatch();

  const docking = useDocking(ActionKeys.settings);
  const sheetType = docking.sheetType;

  const setOpen = (value: boolean) => {    
    dispatch(setActionOpen({
      key: ActionKeys.settings,
      isOpen: value
    }));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
        label={ Locale.reader.settings.trigger }
        SVG={ TuneIcon }
        shortcut={ RSPrefs.actions.keys[ActionKeys.settings].shortcut } 
        id={ ActionKeys.settings }
      />
      </>
    )
  } else {
    return(
      <>
      <SheetWithType 
        sheetType={ sheetType }
        sheetProps={ {
          id: ActionKeys.settings,
          renderActionIcon: () => <ActionIcon 
            visibility={ RSPrefs.actions.keys[ActionKeys.settings].visibility }
            ariaLabel={ Locale.reader.settings.trigger }
            SVG={ TuneIcon } 
            placement="bottom" 
            tooltipLabel={ Locale.reader.settings.tooltip } 
            onPressCallback={ () => setOpen(!actionState.isOpen) }
          />,
          heading: Locale.reader.settings.heading,
          className: settingsStyles.readerSettings,
          placement: "bottom", 
          isOpen: actionState.isOpen || false,
          onOpenChangeCallback: setOpen, 
          onClosePressCallback: () => setOpen(false),
          docker: docking.getDocker()
        } }
      >
        <ReadingDisplayTheme mapArrowNav={ 2 } />
        <ReadingDisplayCol />
        <ReadingDisplayLayout />
      </SheetWithType>
      </>
    )
  }
}