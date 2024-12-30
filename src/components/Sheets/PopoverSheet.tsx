import React, { useCallback, useEffect, useRef } from "react";

import { RSPrefs } from "@/preferences";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import CloseIcon from "../assets/icons/close.svg";

import { Button, Dialog, DialogTrigger, Heading, Popover, PopoverProps } from "react-aria-components";
import { Docker } from "./Docker";

import { Dockable, ISheet } from "./Sheet";

export interface IPopoverSheet extends ISheet {
  placement?: PopoverProps["placement"];
}

export const PopoverSheet: React.FC<IPopoverSheet> = ({ 
    id,
    renderActionIcon,
    heading,
    className, 
    isOpen,
    onOpenChangeCallback, 
    closeLabel,
    onClosePressCallback,
    placement, 
    children 
  }) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverBodyRef = useRef<HTMLDivElement | null>(null);
  const popoverCloseRef = useRef<HTMLButtonElement | null>(null);

  const computeMaxHeight = useCallback(() => {
    if (!popoverRef.current) return;
    return window.innerHeight - popoverRef.current.offsetTop;
  }, []);

  useEffect(() => {
    if (!popoverBodyRef.current || !isOpen) return;

    // WIP: Pick the fist element that is selected. 
    // Expecting this to become more complex 
    // in order to cover all possible interactive elements
    const firstFocusable: HTMLElement | null = popoverBodyRef.current.querySelector("[data-selected]");
    
    firstFocusable ? firstFocusable.focus() : popoverCloseRef.current?.focus();
  }, [isOpen]);

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
            <div className={ readerSharedUI.popoverHeader }>
              <Heading slot="title" className={ readerSharedUI.popoverHeading }>{ heading }</Heading>
            
              <Docker 
                ref={ popoverCloseRef }
                id={ id }
                onStackCallback={ () => {}}
                onCloseCallback={ onClosePressCallback }
              /> 
            </div>

            <div 
              ref={ popoverBodyRef } 
              className={ readerSharedUI.popoverBody }
            >
              { children }
            </div>
          </Dialog>
        </Popover>
      </DialogTrigger>
  : <></> }
  </>
  )
}