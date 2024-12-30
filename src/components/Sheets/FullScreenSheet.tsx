import React, { useEffect, useRef } from "react";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import sheetStyles from "../assets/styles/sheet.module.css";

import CloseIcon from "../assets/icons/close.svg";

import { ISheet } from "./Sheet";

import { Button, Dialog, DialogTrigger, Heading, Modal } from "react-aria-components";

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
          className={ sheetStyles.fullScreenSheetModal }
        >
          <Dialog className={ className }>
            <div className={ sheetStyles.sheetHeader }>
            <Heading slot="title" className={ sheetStyles.sheetHeading }>{ heading }</Heading>

            <Button 
              ref={ fullScreenCloseRef }
              className={ readerSharedUI.closeButton } 
              aria-label={ closeLabel } 
              onPress={ onClosePressCallback }
            >
              <CloseIcon aria-hidden="true" focusable="false" />
            </Button>
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