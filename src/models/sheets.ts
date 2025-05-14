import { ReactNode, RefObject } from "react";
import { DockingKeys } from "./docking";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { ActionsStateKeys } from "@/lib/actionsReducer";

export enum SheetTypes {
  popover = "popover",
  fullscreen = "fullscreen",
  dockedStart = "docked start",
  dockedEnd = "docked end",
  bottomSheet = "bottomSheet"
}

export enum SheetHeaderVariant {
  close = "close",
  previous = "previous"
}

export interface ISheet {
  id: ActionsStateKeys;
  triggerRef: RefObject<HTMLElement | null>;
  heading: string;
  headerVariant?: SheetHeaderVariant;
  className: string;
  isOpen: boolean;
  onOpenChangeCallback: (isOpen: boolean) => void;
  onClosePressCallback: () => void;
  docker?: DockingKeys[];
  children?: ReactNode;
  resetFocus?: unknown;
  dismissEscapeKeyClose?: boolean;
}

export type SheetPref = BreakpointsMap<SheetTypes> | boolean;