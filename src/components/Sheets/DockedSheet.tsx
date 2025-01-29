import React, { useCallback, useRef } from "react";
import { createPortal } from "react-dom";

import { RSPrefs } from "@/preferences";

import { ISheet } from "@/models/sheets";
import { DockingKeys } from "@/models/docking";
import { LayoutDirection } from "@/models/layout";

import sheetStyles from "../assets/styles/sheet.module.css";

import { Heading } from "react-aria-components";
import { Docker } from "./Docking/Docker";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

import classNames from "classnames";

export interface IDockedSheet extends ISheet {
  flow: DockingKeys.start | DockingKeys.end | null;
}

export const DockedSheet: React.FC<IDockedSheet> = ({ 
    id,
    Trigger,
    heading,
    className, 
    isOpen,
    onOpenChangeCallback, 
    onClosePressCallback,
    docker, 
    flow,
    children 
  }) => {
  const dockPortal = flow && document.getElementById(flow);
  const dockedSheetBodyRef = useRef<HTMLDivElement | null>(null);
  const dockedSheetCloseRef = useRef<HTMLButtonElement | null>(null);

  /*  
  const firstFocusable = useFirstFocusable({
    withinRef: dockedSheetBodyRef, 
    trackedState: isOpen, 
    fallbackRef: dockedSheetCloseRef
  }); 
  */

  const classFromFlow = useCallback(() => {
    if (flow === DockingKeys.start) {
      return RSPrefs.direction === LayoutDirection.ltr ? sheetStyles.dockedSheetLeftBorder : sheetStyles.dockedSheetRightBorder;
    } else if (flow === DockingKeys.end) {
      return RSPrefs.direction === LayoutDirection.ltr ? sheetStyles.dockedSheetRightBorder : sheetStyles.dockedSheetLeftBorder;
    }
  }, [flow]);

  return (
    <>
    { React.Children.toArray(children).length > 0 
      ? <>
        <Trigger />

        { isOpen && dockPortal && createPortal(
          <div className={ classNames(sheetStyles.dockedSheet, className, classFromFlow()) }>
            <div className={ sheetStyles.sheetHeader }>
              <Heading slot="title" className={ sheetStyles.sheetHeading }>{ heading }</Heading>

              <Docker 
                id={ id }
                keys={ docker || [] }
                ref={ dockedSheetCloseRef }
                onCloseCallback={ onClosePressCallback }
              /> 
            </div>
              
            <div 
              ref={ dockedSheetBodyRef } 
              className={ sheetStyles.sheetBody }
            >
              { children }
            </div>
          </div>, 
          dockPortal) 
        }
        </>
      : <></> }
    </>
  )
}