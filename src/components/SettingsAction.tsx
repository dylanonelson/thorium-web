import React from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionComponentVariant, ActionKeys, IActionComponent } from "@/models/actions";
import { BreakpointsSheetMap, SheetTypes } from "@/models/sheets";

import settingsStyles from "./assets/styles/readerSettings.module.css";

import TuneIcon from "./assets/icons/match_case.svg";

import { SheetWithBreakpoints } from "./Sheets/SheetWithBreakpoints";
import { ActionIcon } from "./Templates/ActionIcon";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";
import { ReadingDisplayTheme } from "./ReadingDisplayTheme";

import { useDocking } from "@/hooks/useDocking";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setAction } from "@/lib/actionsReducer";
import { makeBreakpointsMap } from "@/helpers/breakpointsMap";

export const SettingsAction: React.FC<IActionComponent> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.settings]);
  const dispatch = useAppDispatch();

  const docking = useDocking({
    key: ActionKeys.settings,
    docked: actionState.isDocked,
    opened: actionState.isOpen
  });

  const setOpen = (value: boolean) => {    
    dispatch(setAction({
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
      <SheetWithBreakpoints 
        breakpointsMap={ makeBreakpointsMap<BreakpointsSheetMap>(RSPrefs.actions.defaultSheet, SheetTypes, RSPrefs.actions.keys[ActionKeys.settings].sheet) } 
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
          isOpen: actionState.isOpen,
          onOpenChangeCallback: setOpen, 
          onClosePressCallback: () => setOpen(false),
          docker: docking.getDocker()
        } }
      >
        <ReadingDisplayTheme mapArrowNav={ 2 } />
        <ReadingDisplayCol />
        <ReadingDisplayLayout />
      </SheetWithBreakpoints>
      </>
    )
  }
}