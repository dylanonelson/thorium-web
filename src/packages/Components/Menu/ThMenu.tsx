import { ActionComponentVariant } from "@/models/actions";

import { Menu, MenuProps, MenuTrigger, MenuTriggerProps, Popover, PopoverProps } from "react-aria-components";

import { ThMenuButton } from "./ThMenuButton";

import { ThActionButtonProps } from "../Buttons";

export interface ThMenuEntry {
  key: string;
  associatedKey?: string;
  Trigger: React.ComponentType<any>;
  Target?: React.ComponentType<any>;
}

export interface THMenuProps extends MenuProps<ThMenuEntry> {
  triggerRef: React.RefObject<HTMLButtonElement>;
  items?: Iterable<ThMenuEntry>;
  menu?: {
    trigger?: MenuTriggerProps,
    button?: ThActionButtonProps,
    popover?: PopoverProps
  }
}

export const ThMenu = ({ 
  id,
  triggerRef,
  items,
  dependencies,
  menu,
  ...props
}: THMenuProps) => {
  if (items) {
    return (
      <>
      <MenuTrigger { ...menu?.trigger }>
        <ThMenuButton 
          { ...menu?.button }
        />
        <Popover { ...menu?.popover }>
          <Menu 
            id={ id }
            dependencies={ dependencies }
            { ...props }
          >
            { Array.from(items).map(({ Trigger, key, associatedKey }) => 
              <Trigger 
                key={ `${ key }-menuItem` } 
                variant={ ActionComponentVariant.menu }
                { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
                { ...props }
              />
            )}
          </Menu>
        </Popover>
      </MenuTrigger>
      { Array.from(items).map(({ Target, key }) => 
        Target && <Target key={ `${ key }-container` } triggerRef={ triggerRef } { ...props } />
      )}
      </>
    )
  }
}