import React, { useCallback, useRef } from "react";

import sheetStyles from "../assets/styles/sheet.module.css";

import { ISheet, SheetTypes } from "./Sheet";

import { Dialog, DialogTrigger, Heading, Popover, PopoverProps } from "react-aria-components";
import { Docker } from "./Docking/Docker";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

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
  const firstFocusable = useFirstFocusable({
    withinRef: popoverBodyRef, 
    trackedState: isOpen, 
    fallbackRef: popoverCloseRef
  });

  const computeMaxHeight = useCallback(() => {
    if (!popoverRef.current) return;
    return window.innerHeight - popoverRef.current.offsetTop;
  }, []);

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
                id={ id }
                ref={ popoverCloseRef }
                sheetType={ SheetTypes.popover }
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