import { Fragment, useRef } from "react";

import { ActionComponentVariant, IActions } from "@/models/actions";

export const Actions = ({
  items,
  className,
  label
}: IActions) => {
  const ref = useRef<HTMLDivElement | null>(null);
  
  return (
    <>
    <div 
      ref={ ref }
      className={ className } 
      aria-label={ label }
    >
      { items.map(({ Trigger, Container, key, associatedKey, ...props }) => 
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
    </div>
    </>
  )
}