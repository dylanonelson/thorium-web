import { IActions } from "./Actions";

import { OverflowMenu } from "./OverflowMenu";

import { useCollapsibility } from "@/hooks/useCollapsibility";

export interface IActionsWithCollapsibility extends IActions {
  invert?: boolean;
}

export const ActionsWithCollapsibility = ({
  items,
  className,
  label,
  invert
}: IActionsWithCollapsibility) => {
  const Actions = useCollapsibility();

  return (
    <>
    <div 
      className={ className } 
      aria-label={ label }
    >
      { !invert ? Actions.ActionIcons : <></> }

      <OverflowMenu>
        { Actions.MenuItems }
      </OverflowMenu>

      { invert ? Actions.ActionIcons : <></> }
    </div>
    </>
  )
}