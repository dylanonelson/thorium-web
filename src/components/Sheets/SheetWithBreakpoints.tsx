import { ReactNode } from "react";

import { BreakpointsSheetMap, SheetTypes } from "@/models/sheets";
import { DockingKeys } from "@/models/docking";

import { FullScreenSheet, IFullScreenSheet } from "./FullScreenSheet";
import { IPopoverSheet, PopoverSheet } from "./PopoverSheet";
import { DockedSheet } from "./DockedSheet";

import { useAppSelector } from "@/lib/hooks";
import { DraggableBottomSheet } from "./DraggableBottomSheet";

export const SheetWithBreakpoints = ({ 
    breakpointsMap, 
    sheetProps,
    children
  }: {
    breakpointsMap: Required<BreakpointsSheetMap>, 
    sheetProps: IFullScreenSheet | IPopoverSheet,
    children: ReactNode
  }) => {
    const dockingStart = useAppSelector(state => state.actions.dock[DockingKeys.start]);
    const dockingEnd = useAppSelector(state => state.actions.dock[DockingKeys.end]);

    const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);
    const sheetType = staticBreakpoint && breakpointsMap[staticBreakpoint];

    if (dockingStart.active && dockingStart.actionKey === sheetProps.id) {
      return (
        <>
        <DockedSheet side={ DockingKeys.start } { ...sheetProps }>
          { children } 
        </DockedSheet>
        </>
      )
    } else if (dockingEnd.active && dockingEnd.actionKey === sheetProps.id) {
      return (
        <>
        <DockedSheet side={ DockingKeys.end } { ...sheetProps }>
          { children } 
        </DockedSheet>
        </>
      )
    }

    if (sheetType === SheetTypes.fullscreen) {
      return (
        <>
        <FullScreenSheet { ...sheetProps }>
          { children }
        </FullScreenSheet>
        </>
      )
    }

    if (sheetType === SheetTypes.bottomSheet) {
      return (
        <>
        <DraggableBottomSheet { ...sheetProps }>
          { children }
        </DraggableBottomSheet>
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