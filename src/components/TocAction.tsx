import React from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../resources/locales/en.json";
import tocStyles from "./assets/styles/toc.module.css";

import TocIcon from "./assets/icons/toc.svg";

import { Links } from "@readium/shared";

import { ActionIcon } from "./Templates/ActionIcon";
import { ListBox, ListBoxItem } from "react-aria-components";
import { PopoverSheet } from "./Sheets/PopoverSheet";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ActionComponentVariant, ActionKeys, IActionComponent } from "./Templates/ActionComponent";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTocOpen } from "@/lib/readerReducer";

export const TocAction: React.FC<IActionComponent & { toc: Links }> = ({ variant, toc }) => {
  const isOpen = useAppSelector(state => state.reader.tocOpen);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setTocOpen(value));
  }

  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
      label={ Locale.reader.toc.trigger }
      SVG={ TocIcon } 
      shortcut={ RSPrefs.actions[ActionKeys.toc].shortcut }
      id={ ActionKeys.toc }
    />
    </>
    )
  } else {
    return(
      <>
      <PopoverSheet
        id={ ActionKeys.toc }
        renderActionIcon={ () => <ActionIcon 
          visibility={ RSPrefs.actions[ActionKeys.toc].visibility }
          ariaLabel={ Locale.reader.toc.trigger } 
          SVG={ TocIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.toc.tooltip } 
          onPressCallback={ () => setOpen(true) }
        /> } 
        heading={ Locale.reader.toc.heading }
        className={ tocStyles.tocPopover } 
        placement="bottom" 
        isOpen={ isOpen }
        onOpenChangeCallback={ setOpen }
        closeLabel={ Locale.reader.toc.close }
        onClosePressCallback={ () => setOpen(false) }
      >
        { toc.items.length > 0 
          ? <ListBox className={ tocStyles.listBox } items={ toc.items }>
              { item => <ListBoxItem className={ tocStyles.listItem } id={ item.title } data-href={ item.href }>{ item.title }</ListBoxItem> }
            </ListBox>
          : <div className={ tocStyles.empty }>{ Locale.reader.toc.empty }</div>
        }
      </PopoverSheet>
      </>
      )
  }
}