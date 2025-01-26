import React, { ReactNode, RefObject, useRef } from "react";

import {OverlayTriggerState, useOverlayTriggerState} from "react-stately";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { ISheet } from "@/models/sheets";

import sheetStyles from "../assets/styles/sheet.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { Sheet, SheetRef } from "react-modal-sheet";
import { DragIndicator } from "./DragIndicator";
import { Heading } from "react-aria-components";
import { CloseButton } from "../CloseButton";

import { FocusScope, OverlayProvider, useButton, useDialog, useModal, useOverlay } from "react-aria";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

import classNames from "classnames";

export interface IDraggableBottomSheet extends ISheet {};

const DraggableBottomSheetComtainer = ({
  sheetState,
  className,
  heading,
  onClosePressCallback,
  sheetRef,
  sheetContainerRef,
  draggableBottomSheetBodyRef,
  draggableBottomSheetCloseRef,
  children
}: {
  sheetState: OverlayTriggerState,
  className: string,
  heading: string,
  onClosePressCallback: () => void,
  sheetRef: RefObject<SheetRef | null>,
  sheetContainerRef: RefObject<HTMLDivElement | null>,
  draggableBottomSheetBodyRef: RefObject<HTMLDivElement | null>,
  draggableBottomSheetCloseRef: RefObject<HTMLButtonElement | null>,
  children: ReactNode
}) => {
  const dialog = useDialog({}, sheetContainerRef);
  const overlay = useOverlay({ 
    onClose: sheetState.close, 
    isOpen: true, 
    isDismissable: true 
  },
    sheetContainerRef
  );

  const closeButton = useButton({}, draggableBottomSheetCloseRef);

  useModal();

  return (
    <>
    <Sheet.Container 
      className={ sheetStyles.draggableBottomSheetModal } 
      ref={ sheetContainerRef }
      { ...overlay.overlayProps as any}
      { ...dialog.dialogProps }
    >
      <Sheet.Header>
        <DragIndicator />
        <div className={ sheetStyles.draggableBottomSheetHeader }>
          <Heading 
            slot="title" 
            className={ sheetStyles.sheetHeading }
            { ...dialog.titleProps }
          >
            { heading }
          </Heading>
          <CloseButton
            ref={ draggableBottomSheetCloseRef }
            className={ readerSharedUI.closeButton } 
            label={ Locale.reader.app.docker.close.trigger } 
            onPressCallback={ sheetState.close }
            { ...closeButton.buttonProps }
          />
        </div>
      </Sheet.Header>
      <Sheet.Content 
        className={ classNames(sheetStyles.draggableBottomSheet, className) }
        disableDrag={ true } 
        style={{ paddingBottom: sheetRef.current?.y }}
      >
        <Sheet.Scroller 
          draggable={ false }
          className={ sheetStyles.draggableBottomSheetScroller }
        >
          <div 
            ref={ draggableBottomSheetBodyRef } 
            className={ sheetStyles.sheetBody }
          >
            { children }
          </div>
        </Sheet.Scroller>
      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop 
      className={ sheetStyles.draggableBottomSheetBackdrop }
    />
    </>
  )
}

export const DraggableBottomSheet: React.FC<IDraggableBottomSheet> = ({
  id,
  Trigger,
  heading,
  className, 
  isOpen,
  onOpenChangeCallback, 
  onClosePressCallback,
  children 
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const sheetRef = useRef<SheetRef | null>(null);
  const sheetContainerRef = useRef<HTMLDivElement | null>(null);
  const draggableBottomSheetBodyRef = useRef<HTMLDivElement | null>(null);
  const draggableBottomSheetCloseRef = useRef<HTMLButtonElement | null>(null);  
  const minHeightPref = RSPrefs.actions.keys[id].snapped?.minHeight ? RSPrefs.actions.keys[id].snapped?.minHeight / 100 : 0.2;
  const maxHeightPref = RSPrefs.actions.keys[id].snapped?.maxHeight ? RSPrefs.actions.keys[id].snapped?.maxHeight / 100 : 1;
  const peekHeightPref = RSPrefs.actions.keys[id].snapped?.peekHeight ? RSPrefs.actions.keys[id].snapped?.peekHeight / 100 : minHeightPref;

  /*  
  const firstFocusable = useFirstFocusable({
    withinRef: draggableBottomSheetBodyRef, 
    trackedState: isOpen, 
    fallbackRef: draggableBottomSheetCloseRef
  }); */

  let sheetState = useOverlayTriggerState({
    isOpen: isOpen,
    onOpenChange: onOpenChangeCallback
  });

  const { buttonProps } = useButton({
//    onPress: sheetState.open
  }, triggerRef);

  return (
    <>
    { React.Children.toArray(children).length > 0 
    ? <>
      <Trigger { ...buttonProps } ref={ triggerRef } />
      <Sheet
        ref={ sheetRef }
        isOpen={ sheetState.isOpen }
        onClose={ sheetState.close }
        snapPoints={ [maxHeightPref, peekHeightPref, minHeightPref] }
        initialSnap={ 1 }
      >
        <OverlayProvider>
          <FocusScope 
            contain={ true } 
            autoFocus={ true } 
            restoreFocus={ true }
          >
            <DraggableBottomSheetComtainer 
              sheetState={ sheetState } 
              className={ className }
              heading={ heading }
              onClosePressCallback={ onClosePressCallback }
              sheetRef={ sheetRef } 
              sheetContainerRef={ sheetContainerRef }
              draggableBottomSheetBodyRef={ draggableBottomSheetBodyRef }
              draggableBottomSheetCloseRef={ draggableBottomSheetCloseRef }
            >
              { children }
            </DraggableBottomSheetComtainer>
        </FocusScope>
      </OverlayProvider>
    </Sheet> 
    </>
    : <></> }
  </>
  )
}