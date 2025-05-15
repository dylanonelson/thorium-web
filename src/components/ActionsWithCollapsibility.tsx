import { useRef } from "react";

import { ThActionEntry, ThCollapsibleActionsBar } from "@/packages/Components/Actions/ThCollapsibleActionsBar";
import { OverflowMenu } from "./OverflowMenu";
import { ThActionsKeys, ThDockingKeys } from "@/preferences/models/enums";

import { useAppSelector } from "@/lib/hooks";
import { ThCollapsibleActionsBarProps } from "../../dist/components";

export interface StatefulCollapsibleActionsProps extends ThCollapsibleActionsBarProps {
  items: ThActionEntry<ThActionsKeys | ThDockingKeys>[];
  overflowActionCallback?: boolean;
  overflowMenuClassName?: string;
  overflowMenuDisplay?: boolean;
}

export const ActionsWithCollapsibility = ({
  id, 
  items,
  overflowActionCallback,
  overflowMenuClassName,
  overflowMenuDisplay,
  ...props
}: StatefulCollapsibleActionsProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const breakpoint = useAppSelector(state => state.theming.breakpoint);

  return (
    <>
    <ThCollapsibleActionsBar 
      ref={ ref }
      id={ id }
      items={ items }
      breakpoint={ breakpoint }
      overflowMenu={ (<OverflowMenu 
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
