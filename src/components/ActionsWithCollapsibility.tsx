import { IActions } from "./Actions";
import { ActionComponentVariant } from "./Templates/ActionComponent";

import { OverflowMenu } from "./OverflowMenu";

import { useCollapsibility } from "@/hooks/useCollapsibility";

export interface IActionsWithCollapsibility extends IActions {
  prefs: any;
  overflowActionCallback?: boolean;
  overflowMenuClassName?: string;
}

export const ActionsWithCollapsibility = ({
  items,
  prefs,
  className,
  overflowActionCallback,
  overflowMenuClassName,
  label,
}: IActionsWithCollapsibility) => {
  const Actions = useCollapsibility(items, prefs);

  return (
    <>
    <div 
      className={ className } 
      aria-label={ label }
    >
      { Actions.ActionIcons.map(({ Comp, key, associatedID }) => 
          <Comp 
            key={ key } 
            variant={ ActionComponentVariant.button }
            { ...(associatedID ? { associatedID: associatedID } : {}) } 
          />) 
      }

      <OverflowMenu 
        className={ overflowMenuClassName } 
        actionFallback={ overflowActionCallback }
      >
        { Actions.MenuItems.map(({ Comp, key, associatedID }) => 
          <Comp 
            key={ key } 
            variant={ ActionComponentVariant.menu }
            { ...(associatedID ? { associatedID: associatedID } : {}) } 
          />) }
      </OverflowMenu> 
    </div>
    </>
  )
}