import React, { useCallback, useRef } from "react";

import { RSPrefs } from "@/preferences";

import Locale from "../../resources/locales/en.json";

import { ISheet } from "@/models/sheets";

import "react-spring-bottom-sheet/dist/style.css";
import sheetStyles from "../assets/styles/sheet.module.css";
import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import { BottomSheet } from "react-spring-bottom-sheet";
import { Heading } from "react-aria-components";
import { CloseButton } from "../CloseButton";

import { useFirstFocusable } from "@/hooks/useFirstFocusable";

import classNames from "classnames";

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
  // const firstFocusable = useFirstFocusable({
  //  withinRef: draggableBottomSheetBodyRef, 
  //  trackedState: isOpen, 
  //  fallbackRef: draggableBottomSheetCloseRef
  // });

  const makeSnapPoints = useCallback(() => {

  }, [id]);

  return (
    <>
    { React.Children.toArray(children).length > 0 
    ? <>
      { renderActionIcon() }
      <BottomSheet
        open={ isOpen }
      //  initialFocusRef={ true } 
      //  blocking={ true }
        expandOnContentDrag={ false } 
        onDismiss={ () => onOpenChangeCallback(!isOpen) }
      //  snapPoints={ ({}) => [] }
      //  defaultSnap={ 20 }
       className={ sheetStyles.draggableBottomSheetModal }
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