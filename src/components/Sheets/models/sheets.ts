import { ReactNode, RefObject } from "react";
import { ThDockingKeys, ThSheetHeaderVariant } from "@/preferences/models/enums";
import { ActionsStateKeys } from "@/lib/actionsReducer";

export interface StatefulSheet {
  id: ActionsStateKeys;
  triggerRef: RefObject<HTMLElement | null>;
  heading: string;
  headerVariant?: ThSheetHeaderVariant;
  className: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPressClose: () => void;
  docker?: ThDockingKeys[];
  children?: ReactNode;
  resetFocus?: unknown;
  dismissEscapeKeyClose?: boolean;
}