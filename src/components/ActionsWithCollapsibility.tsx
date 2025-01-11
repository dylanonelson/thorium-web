import { ActionComponentVariant, IActions } from "@/models/actions";

import { OverflowMenu } from "./OverflowMenu";

import { useCollapsibility } from "@/hooks/useCollapsibility";

export interface IActionsWithCollapsibility extends IActions {
  prefs: any;
  overflowActionCallback?: boolean;
  overflowMenuClassName?: string;
  overflowMenuDisplay?: boolean;
}

export const ActionsWithCollapsibility = ({
  items,
  prefs,
  className,
  overflowActionCallback,
  overflowMenuClassName,
  overflowMenuDisplay,
  label,
}: IActionsWithCollapsibility) => {
  const Actions = useCollapsibility(items, prefs);

  return (
    <>
    <div 
      className={ className } 
      aria-label={ label }
    >
      { Actions.ActionIcons.map(({ Comp, key, associatedKey }) => 
          <Comp 
            key={ key } 
            variant={ ActionComponentVariant.button }
            { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
          />) 
      }

      <OverflowMenu 
        display={ overflowMenuDisplay || true }
        className={ overflowMenuClassName } 
        actionFallback={ overflowActionCallback }
      >
        { Actions.MenuItems.map(({ Comp, key, associatedKey }) => 
          <Comp 
            key={ key } 
            variant={ ActionComponentVariant.menu }
            { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
          />) }
      </OverflowMenu> 
    </div>
    </>
  )
}