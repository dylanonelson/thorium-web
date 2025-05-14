import { ReactNode, RefObject } from "react";
import { DockingKeys, SheetHeaderVariant, SheetTypes } from "@/preferences/models/enums";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { ActionsStateKeys } from "@/lib/actionsReducer";

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