import { IActionTokens } from "./actions";
import { Collapsibility } from "@/packages/Components/Actions/hooks/useCollapsibility";
import { ActionsStateKeys } from "@/lib/actionsReducer";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { DockingKeys, DockingTypes } from "@/preferences/preferences";

export interface IDocker {
  id: ActionsStateKeys;
  keys: DockingKeys[];
  ref: React.ForwardedRef<HTMLButtonElement>;
  onCloseCallback: () => void;
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
  dockable: DockingTypes,
  dragIndicator?: boolean,
  width?: number,
  minWidth?: number,
  maxWidth?: number
}

export interface IDockingPref {
  displayOrder: DockingKeys[];
  collapse: Collapsibility;
  dock: BreakpointsMap<DockingTypes> | boolean; 
  keys: {
    [key in  DockingKeys]: IActionTokens;
  }
};