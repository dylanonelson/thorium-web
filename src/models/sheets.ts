import { ReactNode, RefObject } from "react";
import { DockingKeys, SheetHeaderVariant } from "@/preferences/models/enums";
import { ActionsStateKeys } from "@/lib/actionsReducer";

export interface StatefulSheet {
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