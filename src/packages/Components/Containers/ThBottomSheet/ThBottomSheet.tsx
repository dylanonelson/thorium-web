"use client";

import React, { 
  CSSProperties,
  RefObject, 
  useCallback, 
  useEffect, 
  useMemo, 
  useState 
} from "react";

import { OverlayTriggerState, useOverlayTriggerState } from "react-stately";

import { ThContainerHeader, ThContainerHeaderProps } from "../ThContainerHeader";
import { ThContainerBody } from "../ThContainerBody";
import { ThContainerProps } from "../ThContainer";
import { useFirstFocusable, UseFirstFocusableProps } from "../hooks/useFirstFocusable";

import { ThDragIndicatorButton, ThDragIndicatorButtonProps } from "./ThDragIndicatorButton";

import { Sheet, SheetRef } from "react-modal-sheet";
import { HeadingProps } from "react-aria-components";
import { 
  AriaOverlayProps, 
  FocusScope, 
  OverlayProvider, 
  useDialog, 
  useModal, 
  useObjectRef, 
  useOverlay 
} from "react-aria";

export interface ThBottomSheetHeaderProps extends ThContainerHeaderProps {
  wrapper: React.ComponentProps<typeof Sheet.Header>,
  dragIndicator: React.ComponentProps<typeof ThDragIndicatorButton>,
  header: ThContainerHeaderProps,
  heading: HeadingProps
}

export interface ThBottomSheetCompounds {
  container?: Omit<React.ComponentProps<typeof Sheet.Container>, "children">,
  header?: React.ComponentProps<typeof Sheet.Header>,
  dragIndicator?: ThDragIndicatorButtonProps,
  content?: React.ComponentProps<typeof Sheet.Content>,
  scroller?: React.ComponentProps<typeof Sheet.Scroller>,
  backdrop?: React.ComponentProps<typeof Sheet.Backdrop>
}

export interface ThBottomSheetProps extends Omit<React.ComponentProps<typeof Sheet>, "children" | "ref" | "isOpen" | "onClose">, AriaOverlayProps, ThContainerProps {
  onOpenChange?: (isOpen: boolean) => void;
  isKeyboardDismissDisabled?: boolean;
  compounds?: ThBottomSheetCompounds;
}

const ThBottomSheetContainer = ({
  sheetRef,
  sheetState,
  isDraggable, 
  isKeyboardDismissDisabled,
  focusOptions,
  compounds,
  children
}: {
  sheetRef: RefObject<HTMLDivElement | SheetRef | null>;
  sheetState: OverlayTriggerState;
  onFullHeight?: Omit<React.ComponentProps<typeof Sheet.Container>, "children">;
  isDraggable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  focusOptions?: UseFirstFocusableProps;
  compounds?: ThBottomSheetCompounds;
  children: ThContainerProps["children"];
}) => {
  const containerRef = useObjectRef(compounds?.container?.ref);
  const scrollerRef = useObjectRef(compounds?.scroller?.ref);
  const dialog = useDialog({}, containerRef);
  const overlay = useOverlay({ 
    onClose: sheetState.close, 
    isOpen: true, 
    isDismissable: true,
    isKeyboardDismissDisabled: isKeyboardDismissDisabled
  }, containerRef);
  const [isFullHeight, setFullHeight] = useState<boolean>(false);

  useModal();

  const fullHeightIntersectionCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach( (entry) => {
      if (
          entry.isIntersecting && 
          entry.intersectionRatio === 1 && 
          // For some reason width is larger on mobile (and border-right is almost invisible)…
          entry.boundingClientRect.width >= window.innerWidth
        ) {
          setFullHeight(true);
      } else {
        setFullHeight(false);
      }
    });
  }, [setFullHeight]);

  useEffect(() => {
    const observer = new IntersectionObserver(fullHeightIntersectionCallback, {
      threshold: 1.0
    });
    containerRef.current && observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    }
  });

  const [Header, Body] = useMemo(() => {
    const header = children.find((child) => child.type === ThContainerHeader);
    const body = children.find((child) => child.type === ThContainerBody);
    
    const modifiedHeader = header ? React.cloneElement(header as React.ReactElement<ThContainerHeaderProps>, {
      ...header.props,
      compounds: {
        ...(header.props as ThContainerHeaderProps).compounds,
        heading: {
          ...(header.props as ThContainerHeaderProps).compounds?.heading,
          ...dialog.titleProps
        }
      }
    }) : null;

    return [modifiedHeader, body];
  }, [children, dialog.titleProps]);

  const updatedFocusOptions = focusOptions ? {
    ...focusOptions,
    scrollerRef: scrollerRef
  } : undefined;

  useFirstFocusable(updatedFocusOptions);

  return (
    <>
    <Sheet.Container 
      { ...compounds?.container }
      ref={ containerRef }
      {...(isFullHeight ? { "data-full-height": "true" } : {} )}
      { ...overlay.overlayProps as any}
      { ...dialog.dialogProps }
    >
      <Sheet.Header
        { ...compounds?.header }
      >
        { isDraggable && 
          <ThDragIndicatorButton 
            { ...compounds?.dragIndicator }
          /> 
        }
        { Header }
      </Sheet.Header>
      <Sheet.Content 
        { ...compounds?.content }
        // Motion being picky with style on bundling so we have to cast like this… 
        { ...(isDraggable ? { style: { paddingBottom: (sheetRef.current as SheetRef)?.y }} as { [key: string]: any } : {} )}
      >
        <Sheet.Scroller 
          ref={ scrollerRef }
          { ...compounds?.scroller }
        >
          { Body }
        </Sheet.Scroller>
      </Sheet.Content>
    </Sheet.Container>
    <Sheet.Backdrop 
      { ...compounds?.backdrop }
    />
    </>
  )
}

export const ThBottomSheet = ({
  id,
  isOpen,
  onOpenChange,
  ref,
  focusOptions,
  isKeyboardDismissDisabled,
  detent,
  snapPoints,
  compounds,
  children, 
  ...props
}: ThBottomSheetProps) => {
  const resolvedRef = useObjectRef(ref);

  let sheetState = useOverlayTriggerState({
    isOpen: isOpen,
    onOpenChange: onOpenChange
  });

  const isDraggable = useMemo(() => snapPoints && snapPoints.length > 1, [snapPoints]);

  return(
    <>
    <Sheet
      ref={ resolvedRef }
      isOpen={ sheetState.isOpen }
      onClose={ sheetState.close }
      // Otherwise buggy with prefersReducedMotion
      // as the bottom sheet won’t be displayed on mount
      style={{
        zIndex: isOpen ? "999999" : "-1",
        visibility: isOpen ? "visible" : "hidden"
      } as CSSProperties }
      detent={ detent }
      snapPoints={ snapPoints }
      { ...props }
    >
      <OverlayProvider>
        <FocusScope 
          contain={ true } 
          autoFocus={ true } 
          restoreFocus={ true }
        >
          <ThBottomSheetContainer 
            sheetRef={ resolvedRef } 
            sheetState={ sheetState } 
            isDraggable= { isDraggable }
            isKeyboardDismissDisabled={ isKeyboardDismissDisabled }
            focusOptions={ focusOptions }
            compounds={ compounds }
          >
            { children }
          </ThBottomSheetContainer>
      </FocusScope>
    </OverlayProvider>
  </Sheet> 
  </>
  )
}