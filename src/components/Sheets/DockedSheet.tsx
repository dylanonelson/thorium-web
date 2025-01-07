import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';

import sheetStyles from "../assets/styles/sheet.module.css";

import { Dockable, ISheet, SheetTypes } from "./Sheet";

import { Heading } from "react-aria-components";
import { Docker } from "./Docking/Docker";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

export interface IDockedSheet extends ISheet {
  side: Dockable.left | Dockable.right | null;
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

  const [dockType, setDockType] = useState<SheetTypes.dockedLeft | SheetTypes.dockedRight | null>(null);

  useEffect(() => {
    if (!side) return;
    
    side === "left" ? setDockType(SheetTypes.dockedLeft) : setDockType(SheetTypes.dockedRight);

    dockPortal.current = document.getElementById(side);
  }, [side]);

  return (
    <>
    { React.Children.toArray(children).length > 0 && dockPortal.current
      ? <>
      { renderActionIcon() }

        { isOpen && createPortal(<div className={ sheetStyles.dockedSheet }>
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
        </div>, dockPortal.current) }
        </>
      : <></> }
    </>
  )
}