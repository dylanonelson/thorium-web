import { ReactNode } from "react";

import { ThDockingKeys, ThSheetTypes } from "@/preferences/models/enums";

import { TypedComponentRenderer } from "@/packages/Components/Containers/TypedComponentRenderer";
import { PopoverSheet, StatefulPopoverSheet } from "./PopoverSheet";
import { BottomSheet, StatefulBottomSheet } from "./BottomSheet";
import { FullScreenSheet, StatefulFullScreenSheet } from "./FullScreenSheet";
import { DockedSheet, StatefulDockedSheet } from "./DockedSheet";

const componentMap = {
  [ThSheetTypes.popover]: PopoverSheet,
  [ThSheetTypes.bottomSheet]: BottomSheet,
  [ThSheetTypes.fullscreen]: FullScreenSheet,
  [ThSheetTypes.dockedStart]: (props: StatefulDockedSheet) => <DockedSheet { ...props } flow={ ThDockingKeys.start } />,
  [ThSheetTypes.dockedEnd]: (props: StatefulDockedSheet) => <DockedSheet { ...props } flow={ ThDockingKeys.end } />
};

export const SheetWithType = ({
  sheetType,
  sheetProps,
  children
}: {
  sheetType: ThSheetTypes,
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