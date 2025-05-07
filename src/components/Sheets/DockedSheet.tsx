import React, { useCallback, useRef } from "react";
import { createPortal } from "react-dom";

import Locale from "../../resources/locales/en.json";

import { ISheet, SheetHeaderVariant } from "@/models/sheets";
import { DockingKeys } from "@/models/docking";
import { LayoutDirection } from "@/preferences";

import sheetStyles from "../assets/styles/sheet.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { Docker } from "./Docking/Docker";
import { ThNavigationButton } from "@/packages/Components/Buttons/ThNavigationButton";

import { useAppSelector } from "@/lib/hooks";

import { ThContainerBody, ThContainerHeader, ThDockedPanel } from "@/packages/Components";

import classNames from "classnames";

export interface IDockedSheet extends ISheet {
  flow: DockingKeys.start | DockingKeys.end | null;
}

export const DockedSheet: React.FC<IDockedSheet> = ({ 
    id,
    heading,
    headerVariant,
    className, 
    isOpen,
    onClosePressCallback,
    docker, 
    flow,
    children,
    resetFocus
  }) => {
  const dockPortal = flow && document.getElementById(flow);
  const dockedSheetHeaderRef = useRef<HTMLDivElement | null>(null);
  const dockedSheetBodyRef = useRef<HTMLDivElement | null>(null);
  const dockedSheetCloseRef = useRef<HTMLButtonElement | null>(null);

  const direction = useAppSelector(state => state.reader.direction);

  const classFromFlow = useCallback(() => {
    if (flow === DockingKeys.start) {
      return direction === LayoutDirection.ltr ? sheetStyles.dockedSheetLeftBorder : sheetStyles.dockedSheetRightBorder;
    } else if (flow === DockingKeys.end) {
      return direction === LayoutDirection.ltr ? sheetStyles.dockedSheetRightBorder : sheetStyles.dockedSheetLeftBorder;
    }
  }, [flow, direction]);

  if (React.Children.toArray(children).length > 0) {
    return(
      <>
      <ThDockedPanel
        isOpen={ isOpen }
        portal={ dockPortal }
        focusOptions={ {
          withinRef: dockedSheetBodyRef, 
          trackedState: isOpen, 
          fallbackRef: dockedSheetCloseRef,
          updateState: resetFocus
        }}
        className={ classNames(sheetStyles.dockedSheet, className, classFromFlow()) }
        style={{
          "--sheet-sticky-header": dockedSheetHeaderRef.current ? `${ dockedSheetHeaderRef.current.clientHeight }px` : undefined
        }}
      >
        <ThContainerHeader 
          ref={ dockedSheetHeaderRef }
          className={ sheetStyles.sheetHeader }
          label={ heading }
          compounds={{
            heading: {
              className: sheetStyles.sheetHeading
            }
          }}
        >
          { headerVariant === SheetHeaderVariant.previous 
            ? <ThNavigationButton
              direction={ direction === "ltr" ? "left" : "right" } 
              label={ Locale.reader.app.back.trigger }
              ref={ dockedSheetCloseRef }
              className={ classNames(className, readerSharedUI.backButton) } 
              aria-label={ Locale.reader.app.back.trigger }
              onPress={ onClosePressCallback }
            /> 
            : <Docker 
              id={ id }
              keys={ docker || [] }
              ref={ dockedSheetCloseRef }
              onCloseCallback={ onClosePressCallback }
            />
          } 
        </ThContainerHeader>
        <ThContainerBody 
          ref={ dockedSheetBodyRef }
          className={ sheetStyles.sheetBody }
        >
          { children }
        </ThContainerBody>
      </ThDockedPanel>
      </>
    )
  }
}