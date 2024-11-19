import React from "react";

import { ActionKeys, RSPrefs } from "@/preferences";

import Locale from "../resources/locales/en.json";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";
import tocStyles from "./assets/styles/toc.module.css";

import TocIcon from "./assets/icons/toc.svg";
import CloseIcon from "./assets/icons/close.svg";

import { Links } from "@readium/shared";

import { ActionIcon } from "./Templates/ActionIcon";
import { Button, Dialog, DialogTrigger, ListBox, ListBoxItem, Popover } from "react-aria-components";

import { useAppDispatch } from "@/lib/hooks";
import { setTocOpen } from "@/lib/readerReducer";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ActionComponentVariant, IActionComponent } from "./Templates/ActionComponent";

export const TocAction: React.FC<IActionComponent & { toc: Links }> = ({ variant, toc }) => {
  const dispatch = useAppDispatch();

  const toggleTocState = (value: boolean) => {
    dispatch(setTocOpen(value));
  }

  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
      <OverflowMenuItem 
      label={ Locale.reader.toc.trigger }
      SVG={ TocIcon } 
      shortcut={ RSPrefs.actions.toc.shortcut }
      id={ ActionKeys.toc }
    />
    </>
    )
  } else {
    return(
      <>
      <DialogTrigger onOpenChange={(val) => toggleTocState(val)}>
        <ActionIcon 
          visibility={ RSPrefs.actions[ActionKeys.toc].visibility }
          ariaLabel={ Locale.reader.toc.trigger } 
          SVG={ TocIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.toc.tooltip }
        />
        { toc && 
        <Popover
          placement="bottom"
          className={tocStyles.tocPopover}
        >
          <Dialog>
          {({ close }) => (
            <>
            <Button
              className={readerSharedUI.closeButton}
              aria-label={Locale.reader.toc.close}
              onPress={close}
            >
              <CloseIcon aria-hidden="true" focusable="false" />
            </Button>
            <ListBox className={tocStyles.listBox} items={toc.items}>
              { item => <ListBoxItem className={ tocStyles.listItem } id={ item.title } data-href={ item.href }>{ item.title }</ListBoxItem>}
            </ListBox>
            </>
          )}
          </Dialog>
        </Popover>
        }
      </DialogTrigger>
      </>
      )
  }
}