import { ReactNode } from "react";

import { DockingKeys, SheetTypes } from "@/preferences/models/enums";

import { TypedComponentRenderer } from "@/packages/Components/Containers/TypedComponentRenderer";
import { PopoverSheet, StatefulPopoverSheet } from "./PopoverSheet";
import { BottomSheet, StatefulBottomSheet } from "./BottomSheet";
import { FullScreenSheet, StatefulFullScreenSheet } from "./FullScreenSheet";
import { DockedSheet, StatefulDockedSheet } from "./DockedSheet";

const componentMap = {
  [SheetTypes.popover]: PopoverSheet,
  [SheetTypes.bottomSheet]: BottomSheet,
  [SheetTypes.fullscreen]: FullScreenSheet,
  [SheetTypes.dockedStart]: (props: StatefulDockedSheet) => <DockedSheet { ...props } flow={ DockingKeys.start } />,
  [SheetTypes.dockedEnd]: (props: StatefulDockedSheet) => <DockedSheet { ...props } flow={ DockingKeys.end } />
};

export const SheetWithType = ({
  sheetType,
  sheetProps,
  children
}: {
  sheetType: SheetTypes,
  sheetProps: StatefulPopoverSheet | StatefulFullScreenSheet | StatefulDockedSheet | StatefulBottomSheet,
  children: ReactNode
}) => {

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