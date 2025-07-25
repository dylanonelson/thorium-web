"use client";

import { useRef } from "react";

import { ThActionsKeys, ThDockingKeys } from "@/preferences";

import { ThActionEntry } from "@/core/Components/Actions/ThActionsBar";
import { ThCollapsibleActionsBar, ThCollapsibleActionsBarProps } from "@/core/Components/Actions/ThCollapsibleActionsBar";
import { StatefulOverflowMenu } from "./StatefulOverflowMenu";

import { useAppSelector } from "@/lib/hooks";

export interface StatefulCollapsibleActionsBarProps extends ThCollapsibleActionsBarProps {
  items: ThActionEntry<string | ThActionsKeys | ThDockingKeys>[];
  overflowMenuClassName?: string;
}

export const StatefulCollapsibleActionsBar = ({
  id, 
  items,
  overflowMenuClassName,
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
      compounds={{
        menu: (<StatefulOverflowMenu 
          id={ id }
          triggerRef={ ref }
          className={ overflowMenuClassName } 
          items={ [] }
      />) }}
      { ...props }
    />
    </>
  )
}
