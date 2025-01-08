import React from "react";

import { ActionComponentVariant, ActionKeys, IActionComponent } from "./Templates/ActionComponent";
import { DockingKeys } from "./Sheets/Sheet";

export interface IActionsItem {
  Comp: React.FunctionComponent<IActionComponent>;
  key: ActionKeys | DockingKeys;
  associatedKey?: string;
}

export interface IActions {
  items: IActionsItem[];
  className: string;
  label: string;
}

export const Actions = ({
  items,
  className,
  label
}: IActions) => {
  
  return (
    <>
    <div 
      className={ className } 
      aria-label={ label }
    >
      { items.map(({ Comp, key, associatedKey }) => 
        <Comp 
          key={ key } 
          variant={ ActionComponentVariant.button } 
          { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
        />) }
    </div>
    </>
  )
}