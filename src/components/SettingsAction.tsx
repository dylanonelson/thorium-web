import React from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionComponentVariant, ActionKeys, IActionComponent } from "@/models/actions";

import settingsStyles from "./assets/styles/readerSettings.module.css";

import TuneIcon from "./assets/icons/match_case.svg";

import { SheetWithBreakpoints } from "./Sheets/SheetWithBreakpoints";
import { ActionIcon } from "./Templates/ActionIcon";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";
import { ReadingDisplayTheme } from "./ReadingDisplayTheme";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSettingsAction } from "@/lib/actionsReducer";
import { makeBreakpointsMap } from "@/helpers/breakpointsMap";

export const SettingsAction: React.FC<IActionComponent> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions[ActionKeys.settings]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setSettingsAction({ isOpen: value }));

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
        breakpointsMap={ makeBreakpointsMap(RSPrefs.actions.keys[ActionKeys.settings].sheet) } 
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
          onClosePressCallback: () => setOpen(false)
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