import { ReactNode } from "react";

import { BreakpointsMap, DockingKeys, SheetTypes } from "./Sheet";
import { FullScreenSheet, IFullScreenSheet } from "./FullScreenSheet";
import { IPopoverSheet, PopoverSheet } from "./PopoverSheet";
import { DockedSheet } from "./DockedSheet";

import { useAppSelector } from "@/lib/hooks";

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
        <DockedSheet side={ DockingKeys.left } { ...sheetProps }>
          { children } 
        </DockedSheet>
        </>
      )
    } else if (dockedRight) {
      return (
        <>
        <DockedSheet side={ DockingKeys.right } { ...sheetProps }>
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