import React, { useRef } from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { ISheet } from "@/models/sheets";

import sheetStyles from "../assets/styles/sheet.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { Sheet, SheetRef } from "react-modal-sheet";
import { Heading } from "react-aria-components";
import { CloseButton } from "../CloseButton";

import classNames from "classnames";
import { DragIndicator } from "./DragIndicator";

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
  const sheetRef = useRef<SheetRef>(null);
  const draggableBottomSheetBodyRef = useRef<HTMLDivElement | null>(null);
  const draggableBottomSheetCloseRef = useRef<HTMLButtonElement | null>(null);
  const minHeightPref = RSPrefs.actions.keys[id].snapped?.minHeight ? RSPrefs.actions.keys[id].snapped?.minHeight / 100 : 0.2;
  const maxHeightPref = RSPrefs.actions.keys[id].snapped?.maxHeight ? RSPrefs.actions.keys[id].snapped?.maxHeight / 100 : 1;
  const peekHeightPref = RSPrefs.actions.keys[id].snapped?.peekHeight ? RSPrefs.actions.keys[id].snapped?.peekHeight / 100 : minHeightPref;

  return (
    <>
    { React.Children.toArray(children).length > 0 
    ? <>
      { renderActionIcon() }
      <Sheet
        ref={ sheetRef }
        isOpen={ isOpen }
        onClose={ onClosePressCallback }
        snapPoints={ [maxHeightPref, peekHeightPref, minHeightPref] }
        initialSnap={ 1 }
      >
        <Sheet.Container 
          className={ sheetStyles.draggableBottomSheetModal } 
          style={{ paddingBottom: sheetRef.current?.y }}
        >
          <Sheet.Header>
            <DragIndicator />
            <div className={ sheetStyles.draggableBottomSheetHeader }>
              <Heading slot="title" className={ sheetStyles.sheetHeading }>{ heading }</Heading>
              <CloseButton
                ref={ draggableBottomSheetCloseRef }
                className={ readerSharedUI.closeButton } 
                label={ Locale.reader.app.docker.close.trigger } 
               onPressCallback={ onClosePressCallback }
              />
            </div>
          </Sheet.Header>
          <Sheet.Content 
            className={ classNames(sheetStyles.draggableBottomSheet, className) }
            disableDrag={ true }
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
          onTap={ onClosePressCallback }
        />
    </Sheet> 
    </>
    : <></> }
  </>
  )
}