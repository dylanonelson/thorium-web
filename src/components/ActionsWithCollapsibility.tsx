import { Fragment, useRef } from "react";

import { IActionsWithCollapsibility } from "@/models/actions";

import { ThActionsBar, ThActionsTriggerVariant, ThCollapsibleActionsBar } from "@/packages/Components";
import { OverflowMenu } from "./OverflowMenu";

import { useAppSelector } from "@/lib";

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
  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);

  return (
    <>
    <ThCollapsibleActionsBar 
      ref={ ref }
      id={ id }
      items={ items }
      prefs={ prefs }
      className={ className }
      aria-label={ label }
      breakpoint={ staticBreakpoint }
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
