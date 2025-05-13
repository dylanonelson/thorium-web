import { useRef } from "react";

import { IActionsWithCollapsibility } from "@/models/actions";

import { ThCollapsibleActionsBar } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { OverflowMenu } from "./OverflowMenu";

import { useAppSelector } from "@/lib/hooks";

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
  const breakpoint = useAppSelector(state => state.theming.breakpoint);

  return (
    <>
    <ThCollapsibleActionsBar 
      ref={ ref }
      id={ id }
      items={ items }
      prefs={ prefs }
      className={ className }
      aria-label={ label }
      breakpoint={ breakpoint }
      overflowMenu={ (<OverflowMenu 
        id={ id }
        triggerRef={ ref }
        display={ overflowMenuDisplay || true }
        className={ overflowMenuClassName } 
        actionFallback={ overflowActionCallback }
        items={ [] }
      />) }
    />
    </>
  )
}
