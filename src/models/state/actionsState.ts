import { ActionKeys } from "../actions";
import { DockingKeys } from "../docking";

export type ActionsStateKeys = Exclude<ActionKeys, ActionKeys.fullscreen>;

export enum setActionType {
  jumpToPosition = "setAction/jumpToPosition",
  settings = "setAction/settings",
  toc = "setAction/toc"
}

export interface IActionStateObject {
  isOpen: boolean;
  isDocked: DockingKeys;
  dockedWidth?: number;
}

export type IActionsState = {
  [key in ActionsStateKeys]: IActionStateObject;
}