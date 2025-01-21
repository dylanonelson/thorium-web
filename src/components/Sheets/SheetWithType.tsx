import { ReactNode } from "react";

import { SheetTypes } from "@/models/sheets";
import { DockingKeys } from "@/models/docking";

import { PopoverSheet, IPopoverSheet } from "./PopoverSheet";
import { DraggableBottomSheet, IDraggableBottomSheet } from "./DraggableBottomSheet";
import { FullScreenSheet, IFullScreenSheet } from "./FullScreenSheet";
import { DockedSheet, IDockedSheet } from "./DockedSheet";

export const SheetWithType = ({
  sheetType,
  sheetProps,
  children
}: {
  sheetType: SheetTypes,
  sheetProps: IPopoverSheet | IFullScreenSheet | IDockedSheet | IDraggableBottomSheet,
  children: ReactNode
}) => {
  if (sheetType === SheetTypes.dockedStart) {
    return (
      <>
      <DockedSheet side={ DockingKeys.start } { ...sheetProps }>
        { children } 
      </DockedSheet>
      </>
    )
  }
  
  if (sheetType === SheetTypes.dockedEnd) {
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
  
  if (sheetType === SheetTypes.popover) {
    return (
      <>
      <PopoverSheet { ...sheetProps }>
        { children }
      </PopoverSheet>
      </>
    )
  }
}