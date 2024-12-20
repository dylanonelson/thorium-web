import { ReactNode } from "react";

import { BreakpointsMap, SheetTypes } from "./Sheet";
import { FullScreenSheet, IFullScreenSheet } from "./FullScreenSheet";
import { IPopoverSheet, PopoverSheet } from "./PopoverSheet";

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
    // TODO: use defaultSheet pref if not null nor undefined
    return (
      <>
      <PopoverSheet { ...sheetProps }>
        { children }
      </PopoverSheet>
      </>
    )
}