"use client";

import React, { useRef } from "react";

import { StatefulSheet } from "./models/sheets";
import { ThSheetHeaderVariant } from "@/preferences/models/enums";

import sheetStyles from "./assets/styles/sheets.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { PopoverProps } from "react-aria-components";

import { ThPopover } from "@/core/Components/Containers/ThPopover";
import { ThContainerHeader } from "@/core/Components/Containers/ThContainerHeader";
import { ThContainerBody } from "@/core/Components/Containers/ThContainerBody";
import { ThNavigationButton } from "@/core/Components/Buttons/ThNavigationButton";
import { StatefulDocker } from "../Docking/StatefulDocker";

import { useI18n } from "@/i18n";
import { useWebkitPatch } from "./hooks/useWebkitPatch";

import { useAppSelector } from "@/lib/hooks";

import classNames from "classnames";

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
    onClosePress,
    placement,
    docker,
    children,
    resetFocus,
    focusWithinRef,
    scrollTopOnFocus,
    dismissEscapeKeyClose
  }: StatefulPopoverSheetProps) => {
  const { t } = useI18n()
  const direction = useAppSelector(state => state.reader.direction);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverHeaderRef = useRef<HTMLDivElement | null>(null);
  const popoverBodyRef = useRef<HTMLDivElement | null>(null);
  const popoverCloseRef = useRef<HTMLButtonElement | null>(null);

  // Warning: This is a temporary fix for a bug in React Aria Components.
  useWebkitPatch(!!isOpen);

  if (React.Children.toArray(children).length > 0) {
    return(
      <>
      <ThPopover 
        ref={ popoverRef }
        triggerRef={ triggerRef }
        focusOptions={{
          withinRef: focusWithinRef ?? popoverBodyRef,
          trackedState: isOpen,
          fallbackRef: popoverCloseRef,
          action: {
            type: "focus",
            options: {
              preventScroll: scrollTopOnFocus ? true : false,
              scrollContainerToTop: scrollTopOnFocus
            }
          },
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
                label={ t("reader.app.back.trigger") }
                ref={ popoverCloseRef }
                className={ classNames(className, readerSharedUI.backButton) } 
                aria-label={ t("reader.app.back.trigger") }
                onPress={ onClosePress }
              />
              : <StatefulDocker 
                id={ id }
                keys={ docker || [] }
                ref={ popoverCloseRef }
                onClose={ onClosePress }
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