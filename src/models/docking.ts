import { IActionTokens } from "./actions";
import { Collapsibility } from "./collapsibility";
import { SheetTypes } from "./sheets";
import { ActionsStateKeys } from "./state/actionsState";

export interface IDocker {
  id: ActionsStateKeys;
  sheetType: SheetTypes | null;
  ref: React.ForwardedRef<HTMLButtonElement>;
  onCloseCallback: () => void;
}

export enum DockingKeys {
  left = "dockingLeft",
  right = "dockingRight",
  transient = "dockingTransient"
}

export enum Dockable {
  none = "none",
  both = "both",
  start = "start",
  end = "end"
}

export type Docked = {
  active: boolean;
  actionKey: ActionsStateKeys;
  width: number;
}

export interface IDockedPref {
  dockable: Dockable,
  width?: number,
  minWidth?: number,
  maxWidth?: number
}

export interface IDockingPref {
  displayOrder: DockingKeys[];
  collapse: Collapsibility;
  defaultWidth: number;
  keys: {
    [key in  DockingKeys]: IActionTokens;
  }
};