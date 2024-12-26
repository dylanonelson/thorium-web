import React from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import settingsStyles from "./assets/styles/readerSettings.module.css";

import TuneIcon from "./assets/icons/match_case.svg";

import { Separator } from "react-aria-components";
import { SheetWithBreakpoints } from "./Sheets/SheetWithBreakpoints";
import { ActionIcon } from "./Templates/ActionIcon";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ActionComponentVariant, ActionKeys, IActionComponent } from "./Templates/ActionComponent";
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";
import { ReadingDisplayTheme } from "./ReadingDisplayTheme";

import { prefToMap } from "./Sheets/Sheet";

import { setHovering, setSettingsOpen } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const SettingsAction: React.FC<IActionComponent> = ({ variant }) => {
  const isOpen = useAppSelector(state => state.reader.settingsOpen);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setSettingsOpen(value));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
        <OverflowMenuItem 
          label={ Locale.reader.settings.trigger }
          SVG={ TuneIcon }
          shortcut={ RSPrefs.actions[ActionKeys.settings].shortcut } 
          id={ ActionKeys.settings }
        />
      </>
    )
  } else {
    return(
      <>
      <SheetWithBreakpoints 
        breakpointsMap={ prefToMap(RSPrefs.actions[ActionKeys.settings].sheet) } 
        sheetProps={{
          id: ActionKeys.settings,
          renderActionIcon: () => <ActionIcon 
            visibility={ RSPrefs.actions[ActionKeys.settings].visibility }
            ariaLabel={ Locale.reader.settings.trigger }
            SVG={ TuneIcon } 
            placement="bottom" 
            tooltipLabel={ Locale.reader.settings.tooltip } 
            onPressCallback={ () => setOpen(true) }
          />,
          heading: Locale.reader.settings.heading,
          className: settingsStyles.readerSettingsPopover,
          placement: "bottom", 
          isOpen: isOpen,
          onOpenChangeCallback: setOpen, 
          closeLabel: Locale.reader.settings.close,
          onClosePressCallback: () => setOpen(false)
        }}
      >
        <ReadingDisplayTheme />
        <Separator />
        <ReadingDisplayCol />
        <Separator />
        <ReadingDisplayLayout />
      </SheetWithBreakpoints>
      </>
    )
  }
}