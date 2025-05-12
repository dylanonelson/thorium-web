import { ComponentType, ReactNode, RefObject, SVGProps } from "react";
import { DockingKeys, IDockedPref } from "./docking";
import { Breakpoints, BreakpointsMap } from "@/packages/Hooks";
import { ISnappedPref, SheetTypes } from "./sheets";
import { ActionsStateKeys } from "./state/actionsState";
import { Collapsibility, CollapsiblePref, CollapsibilityVisibility, ThActionsTriggerVariant, ThActionEntry } from "@/packages/Components";

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
  snapped?: ISnappedPref;
};

export interface IActionPref {
  displayOrder: ActionKeys[];
  collapse: Collapsibility;
  keys: {
    [key in ActionKeys]: IActionTokens;
  }
};