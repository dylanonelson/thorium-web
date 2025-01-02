import React from "react";

import { ActionComponentVariant, ActionKeys, IActionComponent } from "./Templates/ActionComponent";
import { DockingKeys } from "./Sheets/Sheet";

export interface IActionItem {
  Comp: React.FunctionComponent<IActionComponent>;
  key: ActionKeys | DockingKeys;
}

export interface IActions {
  items: IActionItem[];
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
      { items.map(({ Comp, key }) => <Comp key={ key } variant={ ActionComponentVariant.button }/>) }
    </div>
    </>
  )
}