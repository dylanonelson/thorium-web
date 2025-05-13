import { IActionTokens } from "./actions";
import { Collapsibility } from "@/packages/Components/Actions/hooks/useCollapsibility";
import { ActionsStateKeys } from "./state/actionsState";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";

export interface IDocker {
  id: ActionsStateKeys;
  keys: DockingKeys[];
  ref: React.ForwardedRef<HTMLButtonElement>;
  onCloseCallback: () => void;
}

export enum DockingKeys {
  start = "dockingStart",
  end = "dockingEnd",
  transient = "dockingTransient"
}

export enum DockTypes {
  none = "none",
  both = "both",
  start = "start",
  end = "end"
}

export type Docked = {
  actionKey: ActionsStateKeys | null;
  active: boolean;
  collapsed: boolean;
  width?: number;
}

export interface IDockPanelSizes {
  width: number;
  minWidth: number;
  maxWidth: number;
  getCurrentPxWidth: (percentage: number) => number;
}

export interface IDockedPref {
  dockable: DockTypes,
  dragIndicator?: boolean,
  width?: number,
  minWidth?: number,
  maxWidth?: number
}

export interface IDockingPref {
  displayOrder: DockingKeys[];
  collapse: Collapsibility;
  dock: BreakpointsMap<DockTypes> | boolean; 
  keys: {
    [key in  DockingKeys]: IActionTokens;
  }
};