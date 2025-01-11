import { ReactElement, ReactNode } from "react";
import { ActionKeys, IActionIconProps } from "./actions";
import { StaticBreakpoints } from "./staticBreakpoints";

export enum SheetTypes {
  popover = "popover",
  fullscreen = "fullscreen",
  dockedStart = "docked start",
  dockedEnd = "docked end"
}

export type BreakpointsMap = {
  [key in StaticBreakpoints]?: SheetTypes;
}

export interface ISheet {
  id: ActionKeys;
  renderActionIcon: () => ReactElement<IActionIconProps>;
  heading: string;
  className: string;
  isOpen: boolean;
  onOpenChangeCallback: (isOpen: boolean) => void;
  onClosePressCallback: () => void;
  children?: ReactNode;
}

export type SheetPref = SheetTypes | BreakpointsMap;