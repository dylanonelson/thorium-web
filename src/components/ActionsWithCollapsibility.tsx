import { ActionComponentVariant, IActionsWithCollapsibility } from "@/models/actions";

import { OverflowMenu } from "./OverflowMenu";

import { useCollapsibility } from "@/hooks/useCollapsibility";

export const ActionsWithCollapsibility = ({
  id, 
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
      { Actions.ActionIcons.map(({ Comp, key, associatedKey, ...props }) => 
          <Comp 
            key={ key } 
            variant={ ActionComponentVariant.button }
            { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
            { ...props }
          />) 
      }

      <OverflowMenu 
        id={ id }
        display={ overflowMenuDisplay || true }
        className={ overflowMenuClassName } 
        actionFallback={ overflowActionCallback }
      >
        { Actions.MenuItems.map(({ Comp, key, associatedKey, ...props }) => 
          <Comp 
            key={ key } 
            variant={ ActionComponentVariant.menu }
            { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
            { ...props }
          />) }
      </OverflowMenu> 
    </div>
    </>
  )
}