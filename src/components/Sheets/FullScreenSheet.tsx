import React, { useRef } from "react";

import sheetStyles from "../assets/styles/sheet.module.css";

import { ISheet, SheetTypes } from "./Sheet";

import { Dialog, DialogTrigger, Heading, Modal } from "react-aria-components";
import { Docker } from "./Docking/Docker";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

import classNames from "classnames";

export interface IFullScreenSheet extends ISheet {};

export const FullScreenSheet: React.FC<IFullScreenSheet> = ({
    id, 
    renderActionIcon, 
    heading, 
    className, 
    isOpen,
    onOpenChangeCallback, 
    onClosePressCallback,
    children 
  }) => {
  const fullScreenBodyRef = useRef<HTMLDivElement | null>(null);
  const fullScreenCloseRef = useRef<HTMLButtonElement | null>(null);
  const firstFocusable = useFirstFocusable({
    withinRef: fullScreenBodyRef, 
    trackedState: isOpen, 
    fallbackRef: fullScreenCloseRef
  });

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