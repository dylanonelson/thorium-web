"use client";

import { useContext } from "react";

import { PreferencesContext, ThActionsKeys } from "@/preferences";

import Locale from "../../../resources/locales/en.json";

import TocIcon from "./assets/icons/toc.svg";

import { StatefulActionTriggerProps } from "../models/actions";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";

import { StatefulActionIcon } from "../Triggers/StatefulActionIcon";
import { StatefulOverflowMenuItem } from "../Triggers/StatefulOverflowMenuItem";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

export const StatefulTocTrigger = ({ variant }: StatefulActionTriggerProps) => {
  const RSPrefs = useContext(PreferencesContext);
  const actionState = useAppSelector(state => state.actions.keys[ThActionsKeys.toc]);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ThActionsKeys.toc,
      isOpen: value 
    }));
  }

  return(
    <>
    { (variant && variant === ThActionsTriggerVariant.menu) 
      ? <StatefulOverflowMenuItem 
          label={ Locale.reader.toc.trigger }
          SVGIcon={ TocIcon } 
          shortcut={ RSPrefs.actions.keys[ThActionsKeys.toc].shortcut }
          id={ ThActionsKeys.toc }
          onAction={ () => setOpen(!actionState.isOpen) }
        />
      : <StatefulActionIcon 
          visibility={ RSPrefs.actions.keys[ThActionsKeys.toc].visibility }
          aria-label={ Locale.reader.toc.trigger } 
          placement="bottom"
          tooltipLabel={ Locale.reader.toc.tooltip } 
          onPress={ () => setOpen(!actionState.isOpen) }
        >
          <TocIcon aria-hidden="true" focusable="false" />
        </StatefulActionIcon>
    }
    </>
  )
}