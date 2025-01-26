import { ComponentType, ReactNode, RefObject } from "react";
import { StaticBreakpoints } from "./staticBreakpoints";
import { ActionsStateKeys } from "./state/actionsState";
import { DockingKeys } from "./docking";

export enum SheetTypes {
  popover = "popover",
  fullscreen = "fullscreen",
  dockedStart = "docked start",
  dockedEnd = "docked end",
  bottomSheet = "bottomSheet"
}

export type BreakpointsSheetMap = {
  [key in StaticBreakpoints]?: SheetTypes;
}

export interface ISheet {
  id: ActionsStateKeys;
  Trigger: ComponentType<{ ref?: RefObject<HTMLButtonElement | null> }>;
  heading: string;
  className: string;
  isOpen: boolean;
  onOpenChangeCallback: (isOpen: boolean) => void;
  onClosePressCallback: () => void;
  docker?: DockingKeys[];
  children?: ReactNode;
}

export interface ISnappedPref {
  draggable?: boolean;
  peekHeight?: number;
  minHeight?: number;
  maxHeight?: number;
}

export type SheetPref = BreakpointsSheetMap;