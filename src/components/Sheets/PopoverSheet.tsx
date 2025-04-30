import React, { useCallback, useRef } from "react";

import Locale from "../../resources/locales/en.json";

import { ISheet, SheetHeaderVariant } from "@/models/sheets";

import sheetStyles from "../assets/styles/sheet.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { Dialog, Heading, Popover, PopoverProps } from "react-aria-components";
import { NavigationButton } from "@/packages/Components/Buttons/NavigationButton";
import { Docker } from "./Docking/Docker";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

import classNames from "classnames";
import { useAppSelector } from "@/lib/hooks";

export interface IPopoverSheet extends ISheet {
  placement?: PopoverProps["placement"];
}

export const PopoverSheet: React.FC<IPopoverSheet> = ({ 
    id,
    triggerRef,
    heading,
    headerVariant,
    className, 
    isOpen,
    onOpenChangeCallback, 
    onClosePressCallback,
    placement,
    docker,
    children,
    resetFocus,
    dismissEscapeKeyClose
  }) => {
  const direction = useAppSelector(state => state.reader.direction);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverHeaderRef = useRef<HTMLDivElement | null>(null);
  const popoverBodyRef = useRef<HTMLDivElement | null>(null);
  const popoverCloseRef = useRef<HTMLButtonElement | null>(null);

  const firstFocusable = useFirstFocusable({
    withinRef: popoverBodyRef, 
    trackedState: isOpen, 
    fallbackRef: popoverCloseRef,
    updateState: resetFocus
  });

  const computeMaxHeight = useCallback(() => {
    if (!popoverRef.current) return;
    return window.innerHeight - popoverRef.current.offsetTop;
  }, []);

  return (
  <>
  { React.Children.toArray(children).length > 0 
    ? <Popover 
        ref={ popoverRef }
        triggerRef={ triggerRef }
        placement={ placement || "bottom" }
        className={ classNames(sheetStyles.popOverSheet , className) }
        isOpen={ isOpen }
        onOpenChange={ onOpenChangeCallback } 
        isKeyboardDismissDisabled={ dismissEscapeKeyClose }
        maxHeight={ computeMaxHeight() }
        style={{
          "--sheet-sticky-header": popoverHeaderRef.current ? `${ popoverHeaderRef.current.clientHeight }px` : undefined
        }}
      >
        <Dialog className={ sheetStyles.sheetDialog }>
          <div 
            ref={ popoverHeaderRef }
            className={ sheetStyles.sheetHeader }
          > 
            <Heading slot="title" className={ sheetStyles.sheetHeading }>{ heading }</Heading>
            
            { headerVariant === SheetHeaderVariant.previous 
              ? <NavigationButton 
                direction={ direction === "ltr" ? "left" : "right" }
                label={ Locale.reader.app.back.trigger }
                ref={ popoverCloseRef }
                className={ classNames(className, readerSharedUI.backButton) } 
                aria-label={ Locale.reader.app.back.trigger }
                onPress={ onClosePressCallback }
              />
              : <Docker 
                id={ id }
                keys={ docker || [] }
                ref={ popoverCloseRef }
                onCloseCallback={ onClosePressCallback }
              />
            } 
          </div>

          <div 
            ref={ popoverBodyRef } 
            className={ sheetStyles.sheetBody }
          >
            { children }
          </div>
        </Dialog>
      </Popover>
  : <></> }
  </>
  )
}