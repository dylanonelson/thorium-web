import { IActionTokens } from "./actions";
import { Collapsibility } from "./collapsibility";
import { ActionsStateKeys } from "./state/actionsState";
import { StaticBreakpoints } from "./staticBreakpoints";

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

export type DockedKeys = Exclude<ActionsStateKeys,  "overflowMenu">;

export type Docked = {
  actionKey: DockedKeys | null;
  active: boolean;
  open: boolean;
  width?: number;
}

export type BreakpointsDockingMap = {
  [key in StaticBreakpoints]?: DockTypes;
}

export interface IDockingProps {
  key: ActionsStateKeys;
  docked: DockingKeys;
  opened: boolean;
}

export interface IDockPanelSizes {
  width: number;
  minWidth: number;
  maxWidth: number;
}

export interface IDockedPref {
  dockable: DockTypes,
  width?: number,
  minWidth?: number,
  maxWidth?: number
}

export interface IDockingPref {
  displayOrder: DockingKeys[];
  collapse: Collapsibility;
  dock: BreakpointsDockingMap | boolean; 
  defaultWidth: number;
  keys: {
    [key in  DockingKeys]: IActionTokens;
  }
};