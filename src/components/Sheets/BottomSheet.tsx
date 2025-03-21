import React, { KeyboardEvent, ReactNode, RefObject, useCallback, useEffect, useRef, useState } from "react";

import {OverlayTriggerState, useOverlayTriggerState} from "react-stately";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { BottomSheetDetent, IScrimPref, ISheet } from "@/models/sheets";

import sheetStyles from "../assets/styles/sheet.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { Sheet, SheetRef } from "react-modal-sheet";
import { DragIndicatorButton } from "./DragIndicator";
import { Heading } from "react-aria-components";
import { CloseButton } from "../CloseButton";

import { FocusScope, OverlayProvider, useButton, useDialog, useModal, useOverlay } from "react-aria";

import { useAppSelector } from "@/lib/hooks";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

import classNames from "classnames";

export interface IBottomSheet extends ISheet {};

const DEFAULT_SNAPPOINTS = {
  min: 0.3,
  peek: 0.5,
  max: 1
}

const BottomSheetContainer = ({
  sheetState,
  className,
  heading,
  onClosePressCallback,
  onDragPressCallback,
  onDragKeyCallback,
  isDraggable, 
  hasDetent, 
  maxWidth, 
  scrimPref, 
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
  onDragPressCallback: () => void;
  onDragKeyCallback: (event: KeyboardEvent) => void;
  isDraggable: boolean;
  hasDetent: BottomSheetDetent;
  maxWidth?: string;
  scrimPref: IScrimPref;
  sheetRef: RefObject<SheetRef | null>;
  sheetContainerRef: RefObject<HTMLDivElement | null>;
  bottomSheetBodyRef: RefObject<HTMLDivElement | null>;
  bottomSheetCloseRef: RefObject<HTMLButtonElement | null>;
  children: ReactNode;
}) => {
  const sheetScroller = useRef<HTMLDivElement | null>(null);
  const dialog = useDialog({}, sheetContainerRef);
  const overlay = useOverlay({ 
    onClose: sheetState.close, 
    isOpen: true, 
    isDismissable: true 
  }, sheetContainerRef);

  const closeButton = useButton({}, bottomSheetCloseRef);
  const [isFullScreen, setFullScreen] = useState<boolean>(false);

  useModal();

  const getDetentClassName = () => {
    let className = "";
    if (hasDetent === "content-height") {
      className = sheetStyles.bottomSheetModalContentHeightDetent;
    } else {
      className = sheetStyles.bottomSheetModalFullHeightDetent;
    }
    return className;
  };

  const getScrimClassName = () => {
    return scrimPref.active ? sheetStyles.bottomSheetScrim : "";
  };

  const getFullscreenClassName = () => {
    return isFullScreen ? sheetStyles.bottomSheetModalFullHeightReached : "";
  };

  const fullScreenIntersectionCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach( (entry) => {
      if (
          entry.isIntersecting && 
          entry.intersectionRatio === 1 && 
          // For some reason width is larger on mobile (and border-right is almost invisible)…
          entry.boundingClientRect.width >= window.innerWidth && 
          hasDetent === "full-height"
        ) {
        setFullScreen(true);
      } else {
        setFullScreen(false);
      }
    });
  }, [hasDetent, setFullScreen]);

  useEffect(() => {
    const observer = new IntersectionObserver(fullScreenIntersectionCallback, {
      threshold: 1.0
    });
    sheetContainerRef.current && observer.observe(sheetContainerRef.current);

    return () => {
      observer.disconnect();
    }
  });

  useEffect(() => {
    if (sheetScroller.current) {
      (sheetScroller.current.scrollTop = 0);
    }
  }, [children]);

  return (
    <>
    <Sheet.Container 
      className={ classNames(sheetStyles.bottomSheetModal, getDetentClassName(), getFullscreenClassName() ) } 
      ref={ sheetContainerRef }
      { ...overlay.overlayProps as any}
      { ...dialog.dialogProps }
      { ...(maxWidth ? { style: { "--constraints-bottomSheet": maxWidth }}: {}) }
    >
      <Sheet.Header>
        { isDraggable && 
          <DragIndicatorButton 
            onPressCallback={ onDragPressCallback } 
            onKeyUpCallback={ onDragKeyCallback }
          /> 
        }
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
            onPressCallback={ onClosePressCallback }
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
          ref={ sheetScroller}
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
      className={ classNames(sheetStyles.bottomSheetBackdrop, getScrimClassName()) } 
      { ...(scrimPref.override ? { style: { "--defaults-scrim": scrimPref.override }} : {}) }
    />
    </>
  )
}

export const BottomSheet: React.FC<IBottomSheet> = ({
  id,
  heading,
  className, 
  isOpen,
  onOpenChangeCallback, 
  onClosePressCallback,
  children 
}) => {
  const reducedMotion = useAppSelector(state => state.theming.prefersReducedMotion);

  const sheetRef = useRef<SheetRef | null>(null);
  const sheetContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomSheetBodyRef = useRef<HTMLDivElement | null>(null);
  const bottomSheetCloseRef = useRef<HTMLButtonElement | null>(null);

  const detent = useRef<BottomSheetDetent>("full-height");
  const isDraggable = useRef<boolean>(true);

  const getSnapArray = useCallback(() => {
    // Val is always checked in 0...1 range
    const getSecureVal = (val: number, ref: number) => {
      if (val > ref) {
        return val;
      } else {
        return ((1 - ref) / 2) + ref;
      }
    };

    // Array needs max @ index 0 and min @ index 2 when complete
    // If it doesn’t have a max, then peek is @ index 0. This means
    // the initialProp should always be one item from last
    let snapArray: number[] = [];

    const snapPref = RSPrefs.actions.keys[id].snapped;
    if (snapPref) {
      // We must start with minHeight to see if it’s 
      // constrained by a detent as it means
      // the bottom sheet is not draggable.
      // Hence why unshifting into the array instead of pushing
      if (snapPref.minHeight) {
        switch(snapPref.minHeight) {
          case "content-height":
          case "full-height":
          case 100:
            detent.current = snapPref.minHeight === 100 ? "full-height" : snapPref.minHeight;
            isDraggable.current = false;
            return [];
          default:
            const minVal = snapPref.minHeight / 100;
            // Protecting against pref > 100
            minVal > 0 && minVal < 1 
              ? snapArray.unshift(minVal) 
              : snapArray.unshift(DEFAULT_SNAPPOINTS.min);
            break;
        }
      } else {
        // Fallback value
        snapArray.unshift(DEFAULT_SNAPPOINTS.min);
      }

      // From now on, check if value is greater than the previous one in array
      // If not, use DEFAULT_SNAPPOINTS fallback and check it as well
      // This is to protect from cases that don’t validate min < peek < max

      // If peekHeight is constrained by a detent
      // then there is no maxHeight
      if (snapPref.peekHeight) {
        switch(snapPref.peekHeight) {
          case "content-height":
          case "full-height":
          case 100:
            detent.current = snapPref.peekHeight === 100 ? "full-height" : snapPref.peekHeight;
            snapArray.unshift(1);
            return snapArray;
          default:
            const peekVal = snapPref.peekHeight / 100;
            const prevVal = snapArray[0];

            peekVal > 0 && peekVal < 1
              ? snapArray.unshift(getSecureVal(peekVal, prevVal)) 
              : snapArray.unshift(getSecureVal(DEFAULT_SNAPPOINTS.peek, prevVal))
            break;
        }
      } else {
        // Fallback value
        snapArray.unshift(getSecureVal(DEFAULT_SNAPPOINTS.peek, snapArray[0]));
      }

      // If max-height is constrained by a content-height detent
      // then it means the bottom sheet can’t be fullscreen
      // Otherwise we can remove the top corners radii
      if (snapPref.maxHeight) {
        switch(snapPref.maxHeight) {
          case "content-height":
          case "full-height":
          case 100:
            detent.current = snapPref.maxHeight === 100 ? "full-height" : snapPref.maxHeight;
            snapArray.unshift(1);
            return snapArray;
          default:
            const maxVal = snapPref.maxHeight / 100;
            const prevVal = snapArray[0];

            maxVal > 0 && maxVal < 1 
              ? snapArray.unshift(getSecureVal(maxVal, prevVal)) 
              : snapArray.unshift(getSecureVal(DEFAULT_SNAPPOINTS.max, prevVal));
            break;
        }
      } else {
        // Fallback value
        snapArray.unshift(getSecureVal(DEFAULT_SNAPPOINTS.max, snapArray[0]));
      }
    } else {
      // There is no pref set
      // Reminder: order of React Modal Sheet is descending so max, peek, min
      snapArray.push(DEFAULT_SNAPPOINTS.max, DEFAULT_SNAPPOINTS.peek, DEFAULT_SNAPPOINTS.min);
    }

    return snapArray;
  }, [id]);

  const snapArray = useRef<number[]>(getSnapArray());
  const snapIdx = useRef<number | null>(null);

  const onDragPressCallback = useCallback(() => {
    if (snapIdx.current !== null) {
      // Don’t forget we’re having to handle max @ 0 and min @ 2 (decreasing order)
      const nextIdx = snapIdx.current === 0 ? snapArray.current.length - 1 : (snapIdx.current - 1);
      sheetRef.current?.snapTo(nextIdx);
    }
  }, []);

  const onDragKeyCallback = useCallback((e: KeyboardEvent) => {
    if (snapIdx.current !== null) {
      // Don’t forget we’re having to handle max @ 0 and min @ 2 (decreasing order)
      // Implementation is being kept consistent with React Resizable Panels, which
      // implements this logic by default for PanelResizeHandle when focused
      switch(e.code) {
        case "PageUp":
          if (snapIdx.current === 0) return;
          sheetRef.current?.snapTo(0);
          break;
        case "ArrowUp":
          if (snapIdx.current === 0) return;
          sheetRef.current?.snapTo(snapIdx.current - 1);
          break;
        case "PageDown":
          onClosePressCallback();
          break;
        case "ArrowDown":
          if (snapIdx.current === snapArray.current.length - 1) {
            onClosePressCallback();
            break;
          }
          sheetRef.current?.snapTo(snapIdx.current + 1)
          break;
        default:
          break;
      }
    }
  }, [onClosePressCallback]);

  const getMaxWidthPref = () => {
    const maxWidth = RSPrefs.actions.keys[id].snapped?.maxWidth;
    if (typeof maxWidth === "undefined") {
      return undefined;
    } else if (maxWidth === null) {
      return "100%";
    } else {
      return `${ maxWidth }px`;
    }
  };

  const getScrimPref = () => {
    let scrimPref: IScrimPref = {
      active: false,
      override: undefined
    }
    const scrim = RSPrefs.actions.keys[id].snapped?.scrim;
    if (scrim) {
      scrimPref.active = true;

      if (typeof scrim === "string") {
        scrimPref.override = scrim;
      }
    }

    return scrimPref;
  };
 
  const firstFocusable = useFirstFocusable({
    withinRef: bottomSheetBodyRef, 
    trackedState: isOpen, 
    fallbackRef: bottomSheetCloseRef
  });

  let sheetState = useOverlayTriggerState({
    isOpen: isOpen,
    onOpenChange: onOpenChangeCallback
  });

  return (
    <>
    { React.Children.toArray(children).length > 0 
    ? <>
      <Sheet
        ref={ sheetRef }
        isOpen={ sheetState.isOpen }
        onClose={ sheetState.close }
        onOpenEnd={ () => firstFocusable && firstFocusable.focus() }
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
        onSnap={ (index) => { snapIdx.current = index }}
        prefersReducedMotion={ reducedMotion }
        // Otherwise buggy with prefersReducedMotion
        // as the bottom sheet won’t be displayed on mount
        style={{
          zIndex: isOpen ? "999999" : "-1",
          visibility: isOpen ? "visible" : "hidden"
        }}
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
              onDragPressCallback={ onDragPressCallback }
              onDragKeyCallback={ onDragKeyCallback }
              isDraggable= { isDraggable.current }
              hasDetent={ detent.current }
              maxWidth={ getMaxWidthPref() }
              scrimPref={ getScrimPref() }
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