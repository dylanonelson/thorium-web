import { ReactNode } from "react";

import { SheetTypes } from "@/models/sheets";
import { DockingKeys } from "@/models/docking";

import { TypedComponentRenderer } from "@/packages/Components/Containers/TypedComponentRenderer";
import { PopoverSheet, IPopoverSheet } from "./PopoverSheet";
import { BottomSheet, IBottomSheet } from "./BottomSheet";
import { FullScreenSheet, IFullScreenSheet } from "./FullScreenSheet";
import { DockedSheet, IDockedSheet } from "./DockedSheet";

export const SheetWithType = ({
  sheetType,
  sheetProps,
  children
}: {
  sheetType: SheetTypes,
  sheetProps: IPopoverSheet | IFullScreenSheet | IDockedSheet | IBottomSheet,
  children: ReactNode
}) => {
  const componentMap = {
    [SheetTypes.popover]: PopoverSheet,
    [SheetTypes.bottomSheet]: BottomSheet,
    [SheetTypes.fullscreen]: FullScreenSheet,
    [SheetTypes.dockedStart]: (props: IDockedSheet) => <DockedSheet { ...props } flow={ DockingKeys.start } />,
    [SheetTypes.dockedEnd]: (props: IDockedSheet) => <DockedSheet { ...props } flow={ DockingKeys.end } />
  };

  return (
    <TypedComponentRenderer
      type={ sheetType }
      componentMap={ componentMap }
      props={ sheetProps }
    >
      { children }
    </TypedComponentRenderer>
  );
}