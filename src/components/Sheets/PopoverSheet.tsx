import React from "react";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import CloseIcon from "../assets/icons/close.svg";

import { ISheet } from "./Sheet";
import { Button, Dialog, DialogTrigger, Popover, PopoverProps } from "react-aria-components";

export interface IPopoverSheet extends ISheet {
  placement?: PopoverProps["placement"];
}

export const PopoverSheet: React.FC<IPopoverSheet> = ({ 
    renderActionIcon,
    className, 
    isOpen,
    onOpenChangeCallback, 
    closeLabel,
    onClosePressCallback,
    placement, 
    children 
  }) => {

  return (
  <>
  { React.Children.toArray(children).length > 0 
    ? <DialogTrigger>
        { renderActionIcon() }
        <Popover 
          placement={ placement || "bottom" }
          className={ className }
          isOpen={ isOpen }
          onOpenChange={ onOpenChangeCallback } 
        >
          <Dialog>
            <Button 
              className={ readerSharedUI.closeButton } 
              aria-label={ closeLabel } 
              onPress={ onClosePressCallback }
            >
              <CloseIcon aria-hidden="true" focusable="false" />
            </Button>
            { children }
          </Dialog>
        </Popover>
      </DialogTrigger>
  : <></> }
  </>
  )
}