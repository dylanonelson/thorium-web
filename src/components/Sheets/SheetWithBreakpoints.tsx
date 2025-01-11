import { ReactNode } from "react";

import { BreakpointsMap, SheetTypes } from "@/models/sheets";
import { DockingKeys } from "@/models/docking";

import { FullScreenSheet, IFullScreenSheet } from "./FullScreenSheet";
import { IPopoverSheet, PopoverSheet } from "./PopoverSheet";
import { DockedSheet } from "./DockedSheet";

import { useAppSelector } from "@/lib/hooks";
import { useDocking } from "@/hooks/useDocking";

export const SheetWithBreakpoints = ({ 
    breakpointsMap, 
    sheetProps,
    children
  }: {
    breakpointsMap: Required<BreakpointsMap>, 
    sheetProps: IFullScreenSheet | IPopoverSheet,
    children: ReactNode
  }) => {
    const docking = useDocking(sheetProps.id);

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

    if (docking.isCurrentlyLeft()) {
      return (
        <>
        <DockedSheet side={ DockingKeys.left } { ...sheetProps }>
          { children } 
        </DockedSheet>
        </>
      )
    } else if (docking.isCurrentlyRight()) {
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