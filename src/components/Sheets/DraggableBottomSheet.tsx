import React, { useCallback, useEffect, useRef } from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { ISheet } from "@/models/sheets";

import "react-spring-bottom-sheet/dist/style.css";
import sheetStyles from "../assets/styles/sheet.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { BottomSheet } from "react-spring-bottom-sheet";
import { Heading } from "react-aria-components";
import { CloseButton } from "../CloseButton";

import classNames from "classnames";
import { useAppDispatch } from "@/lib/hooks";
import { setImmersive } from "@/lib/readerReducer";

export interface IDraggableBottomSheet extends ISheet {};

export const DraggableBottomSheet: React.FC<IDraggableBottomSheet> = ({
  id,
  renderActionIcon,
  heading,
  className, 
  isOpen,
  onOpenChangeCallback, 
  onClosePressCallback,
  children 
}) => {
  const draggableBottomSheetBodyRef = useRef<HTMLDivElement | null>(null);
  const draggableBottomSheetCloseRef = useRef<HTMLButtonElement | null>(null);
  const minHeightPref = RSPrefs.actions.keys[id].snapped?.minHeight ? RSPrefs.actions.keys[id].snapped?.minHeight / 100 : 0.2;
  const maxHeightPref = RSPrefs.actions.keys[id].snapped?.maxHeight ? RSPrefs.actions.keys[id].snapped?.maxHeight / 100 : 1;
  const peekHeightPref = RSPrefs.actions.keys[id].snapped?.peekHeight ? RSPrefs.actions.keys[id].snapped?.peekHeight / 100 : minHeightPref;

  const dispatch = useAppDispatch();

  // Note: We’re not using firstFocusable because
  // it breaks the component focus scope if we do.
  // We need to pass a React.ref to initialFocusRef prop…
  // Focus issue when scrollable…

  // We need to add a sibling as an overlay so that we can block and dismiss on tap

  return (
    <>
    { React.Children.toArray(children).length > 0 
    ? <>
      { renderActionIcon() }
      <BottomSheet
        className={ sheetStyles.draggableBottomSheetModal }
        open={ isOpen }
      //  initialFocusRef={ false } 
        expandOnContentDrag={ false } 
        onDismiss={ () => onOpenChangeCallback(!isOpen) }
        snapPoints={ ({ maxHeight }) => [
          minHeightPref * maxHeight, 
          peekHeightPref * maxHeight,
          maxHeightPref * maxHeight
        ] 
        }
        defaultSnap={ ({ lastSnap, snapPoints, maxHeight }) => 
          lastSnap && snapPoints.includes(lastSnap) ? lastSnap : peekHeightPref * maxHeight 
        }
        header={
          <>
          <div className={ sheetStyles.draggableBottomSheetHeader }>
            <Heading slot="title" className={ sheetStyles.sheetHeading }>{ heading }</Heading>
              <CloseButton
                ref={ draggableBottomSheetCloseRef }
                className={ readerSharedUI.closeButton } 
                label={ Locale.reader.app.docker.close.trigger } 
                onPressCallback={ onClosePressCallback }
              />
          </div>
          </>
        }
        sibling={
          <div
            data-rsbs-backdrop="true"
            className={ sheetStyles.draggableBottomSheetOverlay }
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClosePressCallback();
            } }
          />
        } 
        blocking={ true }
      >
      <div className={ classNames(sheetStyles.draggableBottomSheet, className) }>
        <div 
          ref={ draggableBottomSheetBodyRef } 
          className={ sheetStyles.sheetBody }
        >
          { children }
        </div>
      </div>
    </BottomSheet> 
    </>
    : <></> }
  </>
  )
}