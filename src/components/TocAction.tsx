import React, { useEffect } from "react";

import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import { ActionComponentVariant, ActionKeys, IActionComponent } from "@/models/actions";
import { SheetTypes } from "@/models/sheets";
import { DockingKeys } from "@/models/docking";

import tocStyles from "./assets/styles/toc.module.css";

import TocIcon from "./assets/icons/toc.svg";

import { ActionIcon } from "./Templates/ActionIcon";
import { ListBox, ListBoxItem } from "react-aria-components";
import { SheetWithType } from "./Sheets/SheetWithType";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";

import { useDocking } from "@/hooks/useDocking";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { dockAction, setActionOpen } from "@/lib/actionsReducer";

export const TocAction: React.FC<IActionComponent> = ({ variant }) => {
  const actionState = useAppSelector(state => state.actions.keys[ActionKeys.toc]);
  const dispatch = useAppDispatch();

  const docking = useDocking(ActionKeys.toc);
  const sheetType = docking.getSheetType();

  const setOpen = (value: boolean) => {
    dispatch(setActionOpen({ 
      key: ActionKeys.toc,
      isOpen: value 
    }));
  }

  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
      label={ Locale.reader.toc.trigger }
      SVG={ TocIcon } 
      shortcut={ RSPrefs.actions.keys[ActionKeys.toc].shortcut }
      id={ ActionKeys.toc }
    />
    </>
    )
  } else {
    return(
      <>
      <SheetWithType 
        sheetType={ sheetType }
        sheetProps={ {
          id: ActionKeys.toc,
          renderActionIcon:() => <ActionIcon 
            visibility={ RSPrefs.actions.keys[ActionKeys.toc].visibility }
            ariaLabel={ Locale.reader.toc.trigger } 
            SVG={ TocIcon } 
            placement="bottom"
            tooltipLabel={ Locale.reader.toc.tooltip } 
            onPressCallback={ () => setOpen(!actionState.isOpen) }
          />, 
          heading:Locale.reader.toc.heading,
          className: tocStyles.toc,
          placement:"bottom",
          isOpen: actionState.isOpen || false,
          onOpenChangeCallback: setOpen,
          onClosePressCallback: () => setOpen(false),
          docker: docking.getDocker()
        } }
      >
        {/* toc.items.length > 0 
          ? <ListBox className={ tocStyles.listBox } items={ toc.items }>
              { item => <ListBoxItem className={ tocStyles.listItem } id={ item.title } data-href={ item.href }>{ item.title }</ListBoxItem> }
            </ListBox>
          : <div className={ tocStyles.empty }>{ Locale.reader.toc.empty }</div>
        */}
        
        <div className={ tocStyles.empty }>{ Locale.reader.toc.empty }</div>
      </SheetWithType>
      </>
      )
  }
}