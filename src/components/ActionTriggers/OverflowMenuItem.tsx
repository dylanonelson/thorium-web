import React from "react";

import { IOverflowMenuItemProp } from "@/models/actions";

import overflowMenuStyles from "../assets/styles/overflowMenu.module.css";

import { Text } from "react-aria-components";
import { Shortcut } from "../Shortcut";

import { ThMenuItem, ThMenuItemProps } from "@/packages/Components";

export interface OverflowMenuItemProps extends Omit<ThMenuItemProps, "shortcut"> {
  shortcut?: string | null
}

export const OverflowMenuItem = ({
  id,
  label,
  SVGIcon,
  shortcut = undefined
}: OverflowMenuItemProps) => {
  const menuItemLabelId = `${id}-label`;
  
  return(
    <>
    <ThMenuItem 
      id={ id } 
      label={ label }
      className={ overflowMenuStyles.menuItem } 
      aria-labelledby={ menuItemLabelId } 
    >
      { SVGIcon && <SVGIcon aria-hidden="true" focusable="false" /> }
      <Text 
        className={ overflowMenuStyles.menuItemLabel } 
        slot="label"
        id={ menuItemLabelId }
      >
        { label }
      </Text>
      { shortcut && <Shortcut
        className={ overflowMenuStyles.menuItemKbdShortcut } 
        rawForm={ shortcut } 
      /> }
    </ThMenuItem>
    </>
  )
}
