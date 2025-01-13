import React from "react";

import { ActionComponentVariant, IActions } from "@/models/actions";

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
      { items.map(({ Comp, key, associatedKey, ...props }) => 
        <Comp 
          key={ key } 
          variant={ ActionComponentVariant.button } 
          { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
          { ...props }
        />) }
    </div>
    </>
  )
}