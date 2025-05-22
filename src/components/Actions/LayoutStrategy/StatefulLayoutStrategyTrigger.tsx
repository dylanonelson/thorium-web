"use client";

import Locale from "../../../resources/locales/en.json";

import LayoutIcon from "./assets/icons/fit_page_width.svg";

import { StatefulActionTriggerProps } from "../models/actions";
import { ThActionsKeys } from "@/preferences/models/enums";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThActionsBar";

import { StatefulActionIcon } from "../Triggers/StatefulActionIcon";
import { StatefulOverflowMenuItem } from "../Triggers/StatefulOverflowMenuItem";

import { usePreferences } from "@/preferences/ThPreferencesProvider";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";
import { setHovering } from "@/lib/readerReducer";

/*
export const StatefulLayoutStrategyTrigger = ({ variant }: StatefulActionTriggerProps) => {
  const RSPrefs = usePreferences();
  
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
  */