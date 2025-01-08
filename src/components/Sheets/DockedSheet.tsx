import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';

import sheetStyles from "../assets/styles/sheet.module.css";

import { DockingKeys, ISheet, SheetTypes } from "./Sheet";

import { Heading } from "react-aria-components";
import { Docker } from "./Docking/Docker";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLeftDock, setRightDock } from "@/lib/readerReducer";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

import classNames from "classnames";

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

  const leftDock = useAppSelector(state => state.reader.leftDock);
  const rightDock = useAppSelector(state => state.reader.rightDock);
  const dispatch = useAppDispatch();

  const [dockType, setDockType] = useState<SheetTypes.dockedLeft | SheetTypes.dockedRight | null>(null);

  const classFromSide = useCallback(() => {
    return side === DockingKeys.left ? sheetStyles.dockedSheetLeftBorder : sheetStyles.dockedSheetRightBorder;
  }, [side])

  useEffect(() => {
    if (!side) return;

    side === DockingKeys.left ? setDockType(SheetTypes.dockedLeft) : setDockType(SheetTypes.dockedRight);

    dockPortal.current = document.getElementById(side);
  }, [side]);

  useEffect(() => {
    if (leftDock?.actionKey === id) {
      dispatch(setLeftDock({
        ...leftDock,
        active: isOpen
      }));
    } else if (rightDock?.actionKey === id) {
      dispatch(setRightDock({
        ...rightDock,
        active: isOpen
      }));
    }
  }, [isOpen]);

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
                onStackCallback={ () => {}}
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