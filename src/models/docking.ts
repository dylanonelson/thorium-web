import { ActionKeys, IActionTokens } from "./actions";
import { Collapsibility } from "./collapsibility";
import { SheetTypes } from "./sheets";

export interface IDocker {
  id: ActionKeys;
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
  actionKey: ActionKeys;
  width: number;
}

export interface IDockingPref {
  displayOrder: DockingKeys[];
  collapse: Collapsibility;
  defaultWidth: number;
  keys: {
    [key in  DockingKeys]: IActionTokens;
  }
};