import { ActionKeys } from "./actions";
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