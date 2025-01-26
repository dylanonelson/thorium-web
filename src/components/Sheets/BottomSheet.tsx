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

export interface IBottomSheet extends ISheet {};

const BottomSheetContainer = ({
  sheetState,
  className,
  heading,
  onClosePressCallback,
  isDraggable, 
  sheetRef,
  sheetContainerRef,
  bottomSheetBodyRef,
  bottomSheetCloseRef,
  children
}: {
  sheetState: OverlayTriggerState,
  className: string,
  heading: string,
  onClosePressCallback: () => void,
  isDraggable: boolean,
  sheetRef: RefObject<SheetRef | null>,
  sheetContainerRef: RefObject<HTMLDivElement | null>,
  bottomSheetBodyRef: RefObject<HTMLDivElement | null>,
  bottomSheetCloseRef: RefObject<HTMLButtonElement | null>,
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

  const closeButton = useButton({}, bottomSheetCloseRef);

  useModal();

  const getDraggableClassName = () => {
    let className = "";
    if (isDraggable) {
      className = sheetStyles.draggableBottomSheetModal;
    }
    return className;
  }

  return (
    <>
    <Sheet.Container 
      className={ classNames(sheetStyles.bottomSheetModal, getDraggableClassName() ) } 
      ref={ sheetContainerRef }
      { ...overlay.overlayProps as any}
      { ...dialog.dialogProps }
    >
      <Sheet.Header>
        { isDraggable && <DragIndicator /> }
        <div className={ sheetStyles.bottomSheetHeader }>
          <Heading 
            slot="title" 
            className={ sheetStyles.sheetHeading }
            { ...dialog.titleProps }
          >
            { heading }
          </Heading>
          <CloseButton
            ref={ bottomSheetCloseRef }
            className={ readerSharedUI.closeButton } 
            label={ Locale.reader.app.docker.close.trigger } 
            onPressCallback={ sheetState.close }
            { ...closeButton.buttonProps }
          />
        </div>
      </Sheet.Header>
      <Sheet.Content 
        className={ classNames(sheetStyles.bottomSheet, className) }
        disableDrag={ true } 
        { ...(isDraggable ? { style: { paddingBottom: sheetRef.current?.y }} : {} )}
      >
        <Sheet.Scroller 
          draggable={ false }
          className={ sheetStyles.bottomSheetScroller }
        >
          <div 
            ref={ bottomSheetBodyRef } 
            className={ sheetStyles.sheetBody }
          >
            { children }
          </div>
        </Sheet.Scroller>
      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop 
      className={ sheetStyles.bottomSheetBackdrop }
    />
    </>
  )
}

export const BottomSheet: React.FC<IBottomSheet> = ({
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
  const bottomSheetBodyRef = useRef<HTMLDivElement | null>(null);
  const bottomSheetCloseRef = useRef<HTMLButtonElement | null>(null); 
  
  const isDraggable = RSPrefs.actions.keys[id].snapped?.draggable === false 
    ? RSPrefs.actions.keys[id].snapped?.draggable 
    : true;
  const minHeightPref = RSPrefs.actions.keys[id].snapped?.minHeight 
    ? RSPrefs.actions.keys[id].snapped?.minHeight / 100 
    : 0.4;
  const maxHeightPref = RSPrefs.actions.keys[id].snapped?.maxHeight 
    ? RSPrefs.actions.keys[id].snapped?.maxHeight / 100 
    : 1;
  const peekHeightPref = RSPrefs.actions.keys[id].snapped?.peekHeight 
    ? RSPrefs.actions.keys[id].snapped?.peekHeight / 100 
    : 0.5;

  /*  
  const firstFocusable = useFirstFocusable({
    withinRef: bottomSheetBodyRef, 
    trackedState: isOpen, 
    fallbackRef: bottomSheetCloseRef
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
        { ...(isDraggable 
          ? { 
            snapPoints: [maxHeightPref, peekHeightPref, minHeightPref], 
            initialSnap: 1
          } 
          : {
            detent: "content-height"
          }) 
        }
      >
        <OverlayProvider>
          <FocusScope 
            contain={ true } 
            autoFocus={ true } 
            restoreFocus={ true }
          >
            <BottomSheetContainer 
              sheetState={ sheetState } 
              className={ className }
              heading={ heading }
              onClosePressCallback={ onClosePressCallback }
              isDraggable= { isDraggable }
              sheetRef={ sheetRef } 
              sheetContainerRef={ sheetContainerRef }
              bottomSheetBodyRef={ bottomSheetBodyRef }
              bottomSheetCloseRef={ bottomSheetCloseRef }
            >
              { children }
            </BottomSheetContainer>
        </FocusScope>
      </OverlayProvider>
    </Sheet> 
    </>
    : <></> }
  </>
  )
}