import { SheetTypes } from "./sheets";

import fontStacks from "@readium/css/css/vars/fontStacks.json";

export enum LayoutDirection {
  ltr = "ltr",
  rtl = "rtl"
}

export interface ILayoutDefaults {
  dockingWidth: number;
  scrim: string;
}

export type Constraints = Extract<SheetTypes, SheetTypes.bottomSheet | SheetTypes.popover>;

export enum ReadingDisplayLayoutOption { 
  scroll = "scroll_option",
  paginated = "page_option"
}

export enum RSPaginationStrategy {
  margin = "margin",
  lineLength = "lineLength",
  columns = "columns"
}

export interface IReaderArrow {
  direction: "left" | "right";
  occupySpace: boolean;
  className?: string;
  disabled: boolean;
  onPressCallback: () => void;
}