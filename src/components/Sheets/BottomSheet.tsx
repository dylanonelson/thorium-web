import React, { ReactNode, RefObject, useCallback, useRef, useState } from "react";

import {OverlayTriggerState, useOverlayTriggerState} from "react-stately";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { BottomSheetDetent, ISheet } from "@/models/sheets";

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
  hasDetent, 
  isFullscreen, 
  sheetRef,
  sheetContainerRef,
  bottomSheetBodyRef,
  bottomSheetCloseRef,
  children
}: {
  sheetState: OverlayTriggerState;
  className: string;
  heading: string;
  onClosePressCallback: () => void;
  isDraggable: boolean;
  hasDetent: BottomSheetDetent;
  isFullscreen: boolean;
  sheetRef: RefObject<SheetRef | null>;
  sheetContainerRef: RefObject<HTMLDivElement | null>;
  bottomSheetBodyRef: RefObject<HTMLDivElement | null>;
  bottomSheetCloseRef: RefObject<HTMLButtonElement | null>;
  children: ReactNode;
}) => {
  const dialog = useDialog({}, sheetContainerRef);
  const overlay = useOverlay({ 
    onClose: sheetState.close, 
    isOpen: true, 
    isDismissable: true 
  }, sheetContainerRef);

  const closeButton = useButton({}, bottomSheetCloseRef);

  useModal();

  const getDetentClassName = () => {
    let className = "";
    if (hasDetent === "content-height") {
      className = sheetStyles.bottomSheetModalContentHeightDetent;
    } else {
      className = sheetStyles.bottomSheetModalFullHeightDetent;
    }
    return className;
  }

  const getFullscreenClassName = () => {
    let className = "";
    if (
        isDraggable && isFullscreen ||
        !isDraggable && (hasDetent === "full-height")
      ) {
      className = sheetStyles.bottomSheetModalFullHeightReached;
    }
    return className;
  }

  return (
    <>
    <Sheet.Container 
      className={ classNames(sheetStyles.bottomSheetModal, getDetentClassName(), getFullscreenClassName() ) } 
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

  const detent = useRef<BottomSheetDetent>("full-height");
  const isDraggable = useRef<boolean>(true);
  const [isFullScreen, setFullScreen] = useState<boolean>(false);

  const getSnapArray = useCallback(() => {
    // Array needs max @ index 0 and min @ index 2
    // Peek is always @ index 1 for initialSnap consistency
    let snapArray: number[] = [];

    const snapPref = RSPrefs.actions.keys[id].snapped;
    if (snapPref) {
      // We must start with minHeight to see if it’s 
      // constrained by a content-height detent though 
      // as it means the bottom sheet is not draggable
      if (snapPref.minHeight) {
        switch(snapPref.minHeight) {
          case "content-height":
            detent.current = "content-height";
            isDraggable.current = false;
            return [];
          case "full-height":
            detent.current = "full-height";
            isDraggable.current = false;
            return [];
          default:
            const minVal = snapPref.minHeight / 100;
            snapArray.unshift(minVal);
            break;
        }
      } else {
        // Fallback value
        snapArray.unshift(0.35);
      }

      // If peekHeight is constrained by a content-height 
      // detent then there is no maxHeight
      if (snapPref.peekHeight) {
        switch(snapPref.peekHeight) {
          case "content-height":
            detent.current = "content-height";
            snapArray.unshift(1);
            return snapArray;
          case "full-height":
            detent.current = "full-height";
            snapArray.unshift(1);
            return snapArray;
          default:
            const peekVal = snapPref.peekHeight / 100;
            snapArray.unshift(peekVal);
            break;
        }
      } else {
        // Fallback value
        snapArray.unshift(0.5);
      }

      // If max-height is constrained by a content-height 
      // detent then it means the bottom sheet can’t be fullscreen
      // Otherwise we can remove the top corners radii
      if (snapPref.maxHeight) {
        switch(snapPref.maxHeight) {
          case "content-height":
            detent.current = "content-height";
            snapArray.unshift(1);
            return snapArray;
          case "full-height":
            detent.current = "full-height";
            snapArray.unshift(1);
            return snapArray;
          default:
            const maxVal = snapPref.maxHeight / 100;
            snapArray.unshift(maxVal);
            break;
        }
      } else {
        // Fallback value
        snapArray.unshift(1);
      }
    }

    return snapArray;
  }, [id]);

  const snapArray = useRef<number[]>(getSnapArray());

  const handleSnapFullscreen = useCallback((index: number) => {
    console.log("hey");

    if (detent.current === "full-height") {
      if (index === 0 && snapArray.current[0] === 1) {
        setFullScreen(true);
      } else {
        setFullScreen(false)
      }
    }
  }, []);

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
        { ...(snapArray.current.length > 1 
          ? { 
            snapPoints: snapArray.current, 
            initialSnap: snapArray.current.length - 2,
            detent: detent.current
          } 
          : {
            detent: detent.current
          }) 
        }
        onSnap={ (index) => { handleSnapFullscreen(index) }}
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
              isDraggable= { isDraggable.current }
              hasDetent={ detent.current }
              isFullscreen={ isFullScreen }
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