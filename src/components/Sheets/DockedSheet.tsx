import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from 'react-dom';

import { ISheet } from "@/models/sheets";
import { DockingKeys } from "@/models/docking";

import sheetStyles from "../assets/styles/sheet.module.css";

import { Heading } from "react-aria-components";
import { Docker } from "./Docking/Docker";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

import classNames from "classnames";

export interface IDockedSheet extends ISheet {
  side: DockingKeys.start | DockingKeys.end | null;
}

export const DockedSheet: React.FC<IDockedSheet> = ({ 
    id,
    renderActionIcon,
    heading,
    className, 
    isOpen,
    onOpenChangeCallback, 
    onClosePressCallback,
    docker, 
    side,
    children 
  }) => {
  const dockPortal = side && document.getElementById(side);
  const dockedSheetBodyRef = useRef<HTMLDivElement | null>(null);
  const dockedSheetCloseRef = useRef<HTMLButtonElement | null>(null);
  const firstFocusable = useFirstFocusable({
    withinRef: dockedSheetBodyRef, 
    trackedState: isOpen, 
    fallbackRef: dockedSheetCloseRef
  });

  const classFromSide = useCallback(() => {
    return side === DockingKeys.start ? sheetStyles.dockedSheetLeftBorder : sheetStyles.dockedSheetRightBorder;
  }, [side]);

  return (
    <>
    { React.Children.toArray(children).length > 0 
      ? <>
      { renderActionIcon() }

        { isOpen && dockPortal && createPortal(
          <div className={ classNames(sheetStyles.dockedSheet, className, classFromSide()) }>
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