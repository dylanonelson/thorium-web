import { Fragment, useRef } from "react";

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
  label
}: IActionsWithCollapsibility) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const Actions = useCollapsibility(items, prefs);

  return (
    <>
    <div 
      ref={ ref }
      className={ className } 
      aria-label={ label }
    >
      { Actions.ActionIcons.map(({ Trigger, Container, key, associatedKey, ...props }) => 
          <Fragment key={ key }>
            <Trigger 
              key={ `${ key }-trigger` } 
              variant={ ActionComponentVariant.button }
              { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
              { ...props }
            />
            { Container && <Container key={ `${ key }-container` } triggerRef={ ref } /> }
          </Fragment>
        ) 
      }

      <OverflowMenu 
        id={ id }
        display={ overflowMenuDisplay || true }
        className={ overflowMenuClassName } 
        actionFallback={ overflowActionCallback }
        actionItems={ Actions.MenuItems }
      />
    </div>
    </>
  )
}