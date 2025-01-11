import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';

import { ISheet, SheetTypes } from "@/models/sheets";
import { DockingKeys } from "@/models/docking";

import sheetStyles from "../assets/styles/sheet.module.css";

import { Heading } from "react-aria-components";
import { Docker } from "./Docking/Docker";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLeftDock, setRightDock } from "@/lib/readerReducer";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

import classNames from "classnames";
import { useDocking } from "@/hooks/useDocking";

export interface IDockedSheet extends ISheet {
  side: DockingKeys.left | DockingKeys.right | null;
}

export const DockedSheet: React.FC<IDockedSheet> = ({ 
    id,
    renderActionIcon,
    heading,
    className, 
    isOpen,
    onOpenChangeCallback, 
    onClosePressCallback, 
    side,
    children 
  }) => {
  const dockPortal = useRef<HTMLElement | null>(null);
  const dockedSheetBodyRef = useRef<HTMLDivElement | null>(null);
  const dockedSheetCloseRef = useRef<HTMLButtonElement | null>(null);
  const firstFocusable = useFirstFocusable({
    withinRef: dockedSheetBodyRef, 
    trackedState: isOpen, 
    fallbackRef: dockedSheetCloseRef
  });

  const [dockType, setDockType] = useState<SheetTypes.dockedStart | SheetTypes.dockedEnd | null>(null);

  const classFromSide = useCallback(() => {
    return side === DockingKeys.left ? sheetStyles.dockedSheetLeftBorder : sheetStyles.dockedSheetRightBorder;
  }, [side])

  useEffect(() => {
    if (!side) return;

    side === DockingKeys.left ? setDockType(SheetTypes.dockedStart) : setDockType(SheetTypes.dockedEnd);

    dockPortal.current = document.getElementById(side);
  }, [side]);

  return (
    <>
    { React.Children.toArray(children).length > 0 && dockPortal.current
      ? <>
      { renderActionIcon() }

        { isOpen && createPortal(
          <div className={ classNames(sheetStyles.dockedSheet, className, classFromSide()) }>
            <div className={ sheetStyles.sheetHeader }>
              <Heading slot="title" className={ sheetStyles.sheetHeading }>{ heading }</Heading>

              <Docker 
                id={ id }
                sheetType={ dockType }
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
          dockPortal.current) 
        }
        </>
      : <></> }
    </>
  )
}