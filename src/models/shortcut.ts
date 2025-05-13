import { PShortcut } from "@/packages/Helpers";
import { ActionKeys } from "./actions";

export interface PShortcuts {
  [key: string]: {
    actionKey: ActionKeys;
    modifiers: PShortcut["modifiers"];
  }
}