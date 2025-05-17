import { RefObject } from "react";
import { ThActionsTriggerVariant } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { ActionsStateKeys } from "@/lib/actionsReducer";

export interface StatefulActionsMapObject {
  trigger: React.ComponentType<StatefulActionTriggerProps>;
  target?: React.ComponentType<StatefulActionContainerProps>;
}

export interface StatefulActionTriggerProps {
  variant: ThActionsTriggerVariant;
  associatedKey?: ActionsStateKeys;
}

export interface StatefulActionContainerProps {
  triggerRef: RefObject<HTMLElement | null>;
}