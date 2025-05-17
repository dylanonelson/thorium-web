"use client";

import { ThDockingKeys } from "@/preferences/models/enums";
import { StatefulActionsMapObject } from "../Actions/models/actions";
import { StatefulDockEnd } from "./StatefulDockEnd";
import { StatefulDockStart } from "./StatefulDockStart";
import { StatefulDockTransientPopover } from "./StatefulDockTransientPopover";

export const dockingComponentsMap: Record<ThDockingKeys, StatefulActionsMapObject> = {
  [ThDockingKeys.start]: {
    trigger: StatefulDockStart
  },
  [ThDockingKeys.end]: {
    trigger: StatefulDockEnd
  },
  [ThDockingKeys.transient]: {
    trigger: StatefulDockTransientPopover
  }
};