import React, { useCallback, useEffect, useRef } from "react";

import sheetStyles from "../assets/styles/sheet.module.css";

import { ISheet } from "./Sheet";

import { Dialog, DialogTrigger, Heading, Popover, PopoverProps } from "react-aria-components";
import { Docker } from "./Docking/Docker";

import classNames from "classnames";

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

  // TODO: custom hook
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
          className={ classNames(sheetStyles.popOverSheet , className) }
          isOpen={ isOpen }
          onOpenChange={ onOpenChangeCallback } 
          maxHeight={ computeMaxHeight() }
        >
          <Dialog className={ sheetStyles.sheetDialog }>
            <div className={ sheetStyles.sheetHeader }>
              <Heading slot="title" className={ sheetStyles.sheetHeading }>{ heading }</Heading>
            
              <Docker 
                ref={ popoverCloseRef }
                id={ id }
                onStackCallback={ () => {}}
                onCloseCallback={ onClosePressCallback }
              /> 
            </div>

            <div 
              ref={ popoverBodyRef } 
              className={ sheetStyles.sheetBody }
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