import React, { useCallback, useRef } from "react";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import CloseIcon from "../assets/icons/close.svg";

import { Button, Dialog, DialogTrigger, Popover, PopoverProps } from "react-aria-components";

import { ISheet } from "./Sheet";

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
    const popoverRef = useRef<HTMLDivElement | null>(null);

    const computeMaxHeight = useCallback(() => {
      if (!popoverRef.current) return;

      return window.innerHeight - popoverRef.current.offsetTop;
    }, [])

  return (
  <>
  { React.Children.toArray(children).length > 0 
    ? <DialogTrigger>
        { renderActionIcon() }
        <Popover 
          ref={ popoverRef }
          placement={ placement || "bottom" }
          className={ className }
          isOpen={ isOpen }
          onOpenChange={ onOpenChangeCallback } 
          maxHeight={ computeMaxHeight() }
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