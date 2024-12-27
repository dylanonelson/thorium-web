import React from "react";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import sheetStyles from "../assets/styles/sheet.module.css";

import CloseIcon from "../assets/icons/close.svg";

import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";

import { ISheet } from "./Sheet";

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

  return (
  <>
  { React.Children.toArray(children).length > 0 
    ? <DialogTrigger 
        isOpen={ isOpen }
        onOpenChange={ onOpenChangeCallback }
      >
        { renderActionIcon() }
        <ModalOverlay className={ sheetStyles.fullScreenSheetOverlay }>
          <Modal 
            isDismissable={ true }
            className={ sheetStyles.fullScreenSheetModal }
          >
            <Dialog className={ className }>
              <Heading slot="title" className={ readerSharedUI.popoverHeading }>{ heading }</Heading>

              <Button 
                className={ readerSharedUI.closeButton } 
                aria-label={ closeLabel } 
                onPress={ onClosePressCallback }
              >
                <CloseIcon aria-hidden="true" focusable="false" />
              </Button>

              { children }
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
  : <></> }
  </>
  )
}