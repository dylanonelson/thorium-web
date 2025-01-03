import { IActions } from "./Actions";
import { ActionComponentVariant } from "./Templates/ActionComponent";

import { OverflowMenu } from "./OverflowMenu";

import { useCollapsibility } from "@/hooks/useCollapsibility";

export interface IActionsWithCollapsibility extends IActions {
  prefs: any;
  invert?: boolean;
}

export const ActionsWithCollapsibility = ({
  items,
  prefs,
  className,
  label,
  invert
}: IActionsWithCollapsibility) => {
  const Actions = useCollapsibility(items, prefs);

  return (
    <>
    <div 
      className={ className } 
      aria-label={ label }
    >
      { !invert ? Actions.ActionIcons.map(({ Comp, key }) => <Comp key={ key } variant={ ActionComponentVariant.button }/>) : <></> }

      <OverflowMenu>
        { Actions.MenuItems.map(({ Comp, key }) => <Comp key={ key } variant={ ActionComponentVariant.menu }/>) }
      </OverflowMenu>

      { invert ? Actions.ActionIcons.map(({ Comp, key }) => <Comp key={ key } variant={ ActionComponentVariant.button }/>) : <></> }
    </div>
    </>
  )
}