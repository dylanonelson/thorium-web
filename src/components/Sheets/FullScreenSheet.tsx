import React from "react";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import sheetStyles from "../assets/styles/sheet.module.css";

import CloseIcon from "../assets/icons/close.svg";

import { ISheet } from "./Sheet";
import { Button, Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";

export interface IFullScreenSheet extends ISheet {};

export const FullScreenSheet: React.FC<IFullScreenSheet> = ({ 
  renderActionIcon,
  className, 
  isOpen,
  onOpenChangeCallback, 
  closeLabel,
  onClosePressCallback,
  children }) => {

  const action = renderActionIcon();

  return (
  <>
  { React.Children.toArray(children).length > 0 
    ? <DialogTrigger 
        isOpen={ isOpen }
        onOpenChange={ onOpenChangeCallback 
      }>
        { action }
        <ModalOverlay className={ sheetStyles.fullScreenSheetOverlay }>
          <Modal 
            isDismissable={ true }
            className={ sheetStyles.fullScreenSheetModal }
          >
            <Dialog className={ className }>
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