"use client";

import React, { useRef } from "react";

import Locale from "../../resources/locales/en.json";

import { StatefulSheet } from "./models/sheets";
import { ThSheetHeaderVariant } from "@/preferences/models/enums";

import sheetStyles from "./assets/styles/sheets.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { PopoverProps } from "react-aria-components";

import { ThPopover } from "@/packages/Components/Containers/ThPopover";
import { ThContainerHeader } from "@/packages/Components/Containers/ThContainerHeader";
import { ThContainerBody } from "@/packages/Components/Containers/ThContainerBody";
import { ThNavigationButton } from "@/packages/Components/Buttons/ThNavigationButton";
import { StatefulDocker } from "../Docking/StatefulDocker";

import { useAppSelector } from "@/lib/hooks";

import classNames from "classnames";
import { dockingComponentsMap } from "../Docking/DockingComponentsMap";

export interface StatefulPopoverSheetProps extends StatefulSheet {
  placement?: PopoverProps["placement"];
}

export const StatefulPopoverSheet = ({ 
    id,
    triggerRef,
    heading,
    headerVariant,
    className, 
    isOpen,
    onOpenChange, 
    onPressClose,
    placement,
    docker,
    children,
    resetFocus,
    dismissEscapeKeyClose
  }: StatefulPopoverSheetProps) => {
  const direction = useAppSelector(state => state.reader.direction);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverHeaderRef = useRef<HTMLDivElement | null>(null);
  const popoverBodyRef = useRef<HTMLDivElement | null>(null);
  const popoverCloseRef = useRef<HTMLButtonElement | null>(null);

  if (React.Children.toArray(children).length > 0) {
    return(
      <>
      <ThPopover 
        ref={ popoverRef }
        triggerRef={ triggerRef }
        focusOptions={{
          withinRef: popoverBodyRef,
          trackedState: isOpen,
          fallbackRef: popoverCloseRef,
          updateState: resetFocus
        }}
        placement={ placement || "bottom" }
        className={ classNames(sheetStyles.popOverSheet , className) }
        isOpen={ isOpen }
        onOpenChange={ onOpenChange } 
        isKeyboardDismissDisabled={ dismissEscapeKeyClose }
        style={{
          "--sheet-sticky-header": popoverHeaderRef.current ? `${ popoverHeaderRef.current.clientHeight }px` : undefined
        }}
        compounds={{
          dialog: {
            className: sheetStyles.sheetDialog
          }
        }}
      >
        <ThContainerHeader 
          ref={ popoverHeaderRef }
          className={ sheetStyles.sheetHeader }
          label={ heading }
          compounds={{
            heading: {
              className: sheetStyles.sheetHeading
            }
          }}
        >
          { headerVariant === ThSheetHeaderVariant.previous 
            ? <ThNavigationButton 
                direction={ direction === "ltr" ? "left" : "right" }
                label={ Locale.reader.app.back.trigger }
                ref={ popoverCloseRef }
                className={ classNames(className, readerSharedUI.backButton) } 
                aria-label={ Locale.reader.app.back.trigger }
                onPress={ onPressClose }
              />
              : <StatefulDocker 
                id={ id }
                componentsMap={ dockingComponentsMap }
                keys={ docker || [] }
                ref={ popoverCloseRef }
                onClose={ onPressClose }
              />
          }
        </ThContainerHeader>
        <ThContainerBody
          ref={ popoverBodyRef }
          className={ sheetStyles.sheetBody }
        >
          { children }
        </ThContainerBody>
      </ThPopover>
      </>
    ) 
  }
}