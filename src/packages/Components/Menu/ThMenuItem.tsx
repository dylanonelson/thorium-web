import React from "react";

import { Keyboard, MenuItem, MenuItemProps, Text } from "react-aria-components";

export interface ThMenuItemProps extends MenuItemProps {
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