"use client";

import { DockingKeyType } from "@/preferences";
import { ThDockingKeys } from "@/preferences/models/enums";
import { StatefulActionsMapObject } from "../Actions/models/actions";
import { StatefulDockEnd } from "./StatefulDockEnd";
import { StatefulDockStart } from "./StatefulDockStart";
import { StatefulDockTransientPopover } from "./StatefulDockTransientPopover";

export const dockStartMapping = {
  [ThDockingKeys.start]: {
    trigger: StatefulDockStart
  }
};

export const dockEndMapping = {
  [ThDockingKeys.end]: {
    trigger: StatefulDockEnd
  }
};

export const dockTransientMapping = {
  [ThDockingKeys.transient]: {
    trigger: StatefulDockTransientPopover
  }
};

// Combine maps as needed
export const dockingComponentsMap: Record<DockingKeyType, StatefulActionsMapObject> = {
  ...dockStartMapping,
  ...dockEndMapping,
  ...dockTransientMapping
};