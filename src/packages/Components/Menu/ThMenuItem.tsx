"use client";

import React from "react";

import { Keyboard, MenuItem, MenuItemProps, Text } from "react-aria-components";

export interface ThMenuItemProps extends MenuItemProps {
  ref?: React.Ref<HTMLLIElement>;
  id: string;
  SVGIcon?: React.ComponentType<React.SVGProps<SVGElement>>;
  label: string;
  shortcut?: string;
  classNames?: {
    label: string;
    shortcut: string;
  }
}

export const ThMenuItem = ({
  ref,
  id,
  SVGIcon,
  label, 
  shortcut,
  classNames,
  children,
  ...props
}: ThMenuItemProps) => {
  const menuItemLabelId = `${ id }-label`;  
  return(
    <>
    <MenuItem 
      ref={ ref }
      id={ id } 
      { ...(children ? {} : { "aria-labelledby": menuItemLabelId }) }
      { ...props }
    >
      { children 
        ? children 
        : <>
          { SVGIcon && <SVGIcon aria-hidden="true" focusable="false" /> }
          <Text 
            className={ classNames?.label } 
            slot="label"
            id={ menuItemLabelId }
          >
            { label }
          </Text>
          { shortcut && <Keyboard className={ classNames?.shortcut }>{ shortcut }</Keyboard> }
        </>
      }
    </MenuItem>
    </>
  )
}