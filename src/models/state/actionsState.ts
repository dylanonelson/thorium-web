import { ActionKeys } from "../actions";
import { Docked, DockingKeys } from "../docking";
import { SheetTypes } from "../sheets";

export type ActionsStateKeys = Exclude<ActionKeys, ActionKeys.fullscreen>;

export interface IActionStateObject {
  isOpen: boolean;
  isDocked: DockingKeys;
  pref?: SheetTypes;
  dockedWidth?: number;
}

export interface IActionStateDockPayload {
  type: string;
  payload: {
    key: ActionsStateKeys;
    dockingKey: DockingKeys;
  }
}

export interface IActionStateOpenPayload {
  type: string;
  payload: {
    key: ActionsStateKeys;
    isOpen: boolean;
  }
}

export interface IActionStateDockedPayload {
  type: string;
  payload: { 
    slot: DockingKeys.start | DockingKeys.end;
    docked: Docked;
  }
}

export interface IActionStateSlotPayload {
  type: string;
  payload: DockingKeys.start | DockingKeys.end;
}

export interface IDockState {
  [DockingKeys.start]: Docked;
  [DockingKeys.end]: Docked;
}

export type IActionsState = {
  keys: {
    [key in ActionsStateKeys]: IActionStateObject;
  };
  dock: IDockState
}