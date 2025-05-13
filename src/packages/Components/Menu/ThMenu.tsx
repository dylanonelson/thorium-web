"use client";

import React, { useRef } from "react";

import { Menu, MenuProps, MenuTrigger, MenuTriggerProps, Popover, PopoverProps } from "react-aria-components";

import { ThMenuButton } from "./ThMenuButton";
import { ThActionButtonProps } from "../Buttons";
import { ThActionEntry } from "../Actions/ThCollapsibleActionsBar";
import { ThActionsTriggerVariant } from "../Actions/ThActionsTriggerVariant";

export interface THMenuProps<T> extends MenuProps<ThActionEntry<T>> {
  ref?: React.ForwardedRef<HTMLDivElement>;
  triggerRef?: React.RefObject<HTMLElement | null>;
  items?: Iterable<ThActionEntry<T>>;
  children?: never;
  compounds?: {
    /**
     * Props for the trigger component. See `MenuTriggerProps` for more information.
     */
    trigger?: Omit<MenuTriggerProps, "children">;
    /**
     * Props for the button component. See `ThActionButtonProps` for more information.
     * Alternatively you can provide your own component
     */
    button?: ThActionButtonProps | React.ReactElement<HTMLButtonElement>;
    /**
     * Props for the popover component. See `PopoverProps` for more information.
     */
    popover?: PopoverProps;
  }
}

export const ThMenu = ({
  ref,
  id,
  triggerRef,
  items,
  dependencies,
  compounds,
  ...props
}: THMenuProps<string>) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  if (items) {
    return (
      <>
      <MenuTrigger 
        { ...compounds?.trigger }
      >
      { compounds?.button && React.isValidElement(compounds.button) 
        ? compounds.button 
        : <ThMenuButton 
            ref={ buttonRef }
            { ...compounds?.button as ThActionButtonProps }
          />
        }
        <Popover { ...compounds?.popover }>
          <Menu 
            ref={ ref }
            id={ id }
            dependencies={ dependencies }
            { ...props }
          >
            { Array.from(items).map(({ Trigger, key, associatedKey }) => 
              <Trigger 
                key={ `${ key }-menuItem` } 
                variant={ ThActionsTriggerVariant.menu }
                { ...(associatedKey ? { associatedKey: associatedKey } : {}) } 
                { ...props }
              />
            )}
          </Menu>
        </Popover>
      </MenuTrigger>
      { Array.from(items).map(({ Target, key }) => 
        Target && <Target key={ `${ key }-container` } triggerRef={ triggerRef || buttonRef } { ...props } />
      )}
      </>
    )
  }
}