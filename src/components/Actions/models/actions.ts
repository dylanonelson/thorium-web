import { RefObject } from "react";
import { ThActionsTriggerVariant } from "@/core/Components/Actions/ThActionsBar";
import { ActionsStateKeys } from "@/lib/actionsReducer";

export interface StatefulActionsMapObject {
  Trigger: React.ComponentType<StatefulActionTriggerProps>;
  Target?: React.ComponentType<StatefulActionContainerProps>;
}

export interface StatefulActionTriggerProps {
  variant: ThActionsTriggerVariant;
  associatedKey?: ActionsStateKeys;
}

export interface StatefulActionContainerProps {
  triggerRef: RefObject<HTMLElement | null>;
}