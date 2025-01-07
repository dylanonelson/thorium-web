import { ReactNode, useEffect, useState } from "react";

import { BreakpointsMap, Dockable, SheetTypes } from "./Sheet";
import { FullScreenSheet, IFullScreenSheet } from "./FullScreenSheet";
import { IPopoverSheet, PopoverSheet } from "./PopoverSheet";

import { useAppSelector } from "@/lib/hooks";
import { DockedSheet } from "./DockedSheet";

export const SheetWithBreakpoints = ({ 
    breakpointsMap, 
    sheetProps,
    children
  }: {
    breakpointsMap: Required<BreakpointsMap>, 
    sheetProps: IFullScreenSheet | IPopoverSheet,
    children: ReactNode
  }) => {
    const dockedLeft = useAppSelector(state => state.reader.leftDock);
    const dockedRight = useAppSelector(state => state.reader.rightDock);

    const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);
    const sheetType = staticBreakpoint && breakpointsMap[staticBreakpoint];

    if (sheetType === SheetTypes.fullscreen) {
      return (
        <>
        <FullScreenSheet { ...sheetProps }>
          { children }
        </FullScreenSheet>
        </>
      )
    }

    if (dockedLeft) {
      return (
        <>
        <DockedSheet side={ Dockable.left } { ...sheetProps }>
          { children } 
        </DockedSheet>
        </>
      )
    } else if (dockedRight) {
      return (
        <>
        <DockedSheet side={ Dockable.right } { ...sheetProps }>
          { children } 
        </DockedSheet>
        </>
      )
    }

    return (
      <>
      <PopoverSheet { ...sheetProps }>
        { children }
      </PopoverSheet>
      </>
    )
}