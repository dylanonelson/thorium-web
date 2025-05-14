import { ComponentType, ReactNode, RefObject, SVGProps } from "react";
import { DockingKeys, IDockedPref } from "./docking";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { SheetTypes } from "./sheets";
import { ThActionEntry, ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { Collapsibility, CollapsiblePref, CollapsibilityVisibility } from "@/packages/Components/Actions/hooks/useCollapsibility";
import { SnappedPref } from "@/components/Sheets/BottomSheet";
import { ActionsStateKeys } from "@/lib/actionsReducer";

export enum ActionKeys {
  fullscreen = "fullscreen",
  jumpToPosition = "jumpToPosition",
  layoutStrategy = "layoutStrategy",
  settings = "settings",
  toc = "toc"
}

export interface IActionsMapObject {
  trigger: React.FC<IActionComponentTrigger>;
  target?: React.FC<IActionComponentContainer>;
}

export interface IActionComponentTrigger {
  variant: ThActionsTriggerVariant;
  associatedKey?: ActionsStateKeys;
}

export interface IActionComponentContainer {
  triggerRef: RefObject<HTMLElement | null>;
}

export interface IActions {
  id: string;
  items: ThActionEntry<ActionKeys | DockingKeys>[];
  className: string;
  label: string;
}

export interface IActionsWithCollapsibility extends IActions {
  prefs: CollapsiblePref;
  overflowActionCallback?: boolean;
  overflowMenuClassName?: string;
  overflowMenuDisplay?: boolean;
}

export interface IOverflowMenu {
  id: string;
  items: ThActionEntry<ActionKeys | DockingKeys>[];
  triggerRef: RefObject<HTMLElement | null>;
  className?: string;
  actionFallback?: boolean;
  display: boolean;
  children?: ReactNode;
}

export interface IOverflowMenuItemProp {
  label: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  shortcut?: string | null;
  onActionCallback?: () => void;
  id: string;
  isDisabled?: boolean;
}

export interface IActionTokens {
  visibility: CollapsibilityVisibility;
  shortcut: string | null;
  sheet?: {
    defaultSheet: Exclude<SheetTypes, SheetTypes.dockedStart | SheetTypes.dockedEnd>;
    breakpoints: BreakpointsMap<SheetTypes>;
  };
  docked?: IDockedPref;
  snapped?: SnappedPref;
};

export interface IActionPref {
  displayOrder: ActionKeys[];
  collapse: Collapsibility;
  keys: {
    [key in ActionKeys]: IActionTokens;
  }
};