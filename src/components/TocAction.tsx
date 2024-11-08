import React from "react";

import Locale from "../resources/locales/en.json";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";
import tocStyles from "./assets/styles/toc.module.css";

import TocIcon from "./assets/icons/toc-icon.svg";
import CloseIcon from "./assets/icons/close-icon.svg";

import { Links, Locator } from "@readium/shared";

import { ActionIcon } from "./ActionIcon";
import { Button, Dialog, DialogTrigger, ListBox, ListBoxItem, Popover } from "react-aria-components";
import { useAppDispatch } from "@/lib/hooks";
import { setTocOpen } from "@/lib/readerReducer";

export const TocAction = ({ toc }: { toc: Links }) => {
  const dispatch = useAppDispatch();

  const toggleTocState = (value: boolean) => {
    dispatch(setTocOpen(value));
  }

  return (
    <>
    <DialogTrigger onOpenChange={(val) => toggleTocState(val)}>
      <ActionIcon 
        className={ readerSharedUI.icon }
        ariaLabel={ Locale.reader.toc.trigger } 
        SVG={ TocIcon } 
        placement="bottom"
        tooltipLabel={ Locale.reader.app.actions.toc }
      />
      <Popover 
        placement="bottom" 
        className={ tocStyles.tocPopover }
        >
        <Dialog>
          {({ close }) => (
            <>
            <Button 
              className={ readerSharedUI.closeButton } 
              aria-label={ Locale.reader.toc.close } 
              onPress={ close }
            >
              <CloseIcon aria-hidden="true" focusable="false" />
            </Button>
            <ListBox className={ tocStyles.listBox } items= { toc.items }>
              { item => <ListBoxItem className={ tocStyles.listItem } id={ item.title } data-href={ item.href }>{ item.title }</ListBoxItem>}
            </ListBox>
            </>
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
    </>
  )
}