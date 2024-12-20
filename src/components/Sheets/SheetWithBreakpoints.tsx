import { ReactNode } from "react";

import { StaticBreakpoints } from "@/hooks/useBreakpoints";
import { SheetTypes } from "./Sheet";
import { FullScreenSheet, IFullScreenSheet } from "./FullScreenSheet";
import { IPopoverSheet, PopoverSheet } from "./PopoverSheet";

import { useAppSelector } from "@/lib/hooks";

export type BreakpointsMap = {
  [key in StaticBreakpoints]: SheetTypes;
}

export const SheetWithBreakpoints = ({ 
    breakpointsMap, 
    sheetProps,
    children
  }: {
    breakpointsMap: BreakpointsMap, 
    sheetProps: IFullScreenSheet | IPopoverSheet,
    children: ReactNode
  }) => {
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

    // Default popover
    return (
      <>
      <PopoverSheet { ...sheetProps }>
        { children }
      </PopoverSheet>
      </>
    )
}