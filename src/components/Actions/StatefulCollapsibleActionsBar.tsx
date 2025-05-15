"use client";

import { useRef } from "react";

import { ThActionEntry, ThCollapsibleActionsBar, ThCollapsibleActionsBarProps } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { StatefulOverflowMenu } from "./StatefulOverflowMenu";
import { ThActionsKeys, ThDockingKeys } from "@/preferences/models/enums";

import { useAppSelector } from "@/lib/hooks";

export interface StatefulCollapsibleActionsBarProps extends ThCollapsibleActionsBarProps {
  items: ThActionEntry<ThActionsKeys | ThDockingKeys>[];
  overflowActionCallback?: boolean;
  overflowMenuClassName?: string;
  overflowMenuDisplay?: boolean;
}

export const StatefulCollapsibleActionsBar = ({
  id, 
  items,
  overflowActionCallback,
  overflowMenuClassName,
  overflowMenuDisplay,
  ...props
}: StatefulCollapsibleActionsBarProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const breakpoint = useAppSelector(state => state.theming.breakpoint);

  return (
    <>
    <ThCollapsibleActionsBar 
      ref={ ref }
      id={ id }
      items={ items }
      breakpoint={ breakpoint }
      overflowMenu={ (<StatefulOverflowMenu 
        id={ id }
        triggerRef={ ref }
        display={ overflowMenuDisplay || true }
        className={ overflowMenuClassName } 
        actionFallback={ overflowActionCallback }
        items={ [] }
      />) }
      { ...props }
    />
    </>
  )
}
