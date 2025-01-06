import React, { useEffect, useRef } from "react";

import sheetStyles from "../assets/styles/sheet.module.css";

import { ISheet, SheetTypes } from "./Sheet";

import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components";

import classNames from "classnames";
import { Docker } from "./Docking/Docker";

export interface IFullScreenSheet extends ISheet {};

export const FullScreenSheet: React.FC<IFullScreenSheet> = ({
    id, 
    renderActionIcon, 
    heading, 
    className, 
    isOpen,
    onOpenChangeCallback, 
    closeLabel,
    onClosePressCallback,
    children 
  }) => {
    const fullScreenBodyRef = useRef<HTMLDivElement | null>(null);
    const fullScreenCloseRef = useRef<HTMLButtonElement | null>(null);

    // TODO: custom hook
    useEffect(() => {
      if (!fullScreenBodyRef.current || !isOpen) return;
  
      // WIP: Pick the fist element that is selected. 
      // Expecting this to become more complex 
      // in order to cover all possible interactive elements
      const firstFocusable: HTMLElement | null = fullScreenBodyRef.current.querySelector("[data-selected]");
      
      firstFocusable ? firstFocusable.focus() : fullScreenCloseRef.current?.focus();
    }, [isOpen]);

  return (
  <>
  { React.Children.toArray(children).length > 0 
    ? <DialogTrigger 
        isOpen={ isOpen }
        onOpenChange={ onOpenChangeCallback }
      >
        { renderActionIcon() }
        <Modal 
          isDismissable={ true }
          className={ classNames(sheetStyles.fullScreenSheet, className) }
        >
          <Dialog className={ sheetStyles.sheetDialog }>
            <div className={ sheetStyles.sheetHeader }>
              <Heading slot="title" className={ sheetStyles.sheetHeading }>{ heading }</Heading>

              <Docker 
                id={ id }
                sheetType={ SheetTypes.fullscreen }
                ref={ fullScreenCloseRef }
                onStackCallback={ () => {}}
                onCloseCallback={ onClosePressCallback }
              /> 
            </div>
              
            <div 
              ref={ fullScreenBodyRef } 
              className={ sheetStyles.sheetBody }
            >
              { children }
            </div>
          </Dialog>
        </Modal>
      </DialogTrigger>
  : <></> }
  </>
  )
}