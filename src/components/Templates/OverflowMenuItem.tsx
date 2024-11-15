import React, { ComponentType, SVGProps } from "react";

import { ActionKeys } from "@/preferences";

import overflowMenuStyles from "../assets/styles/overflowMenu.module.css";

import { Keyboard, MenuItem, Text } from "react-aria-components";

import { buildShortcutRepresentation, ShortcutRepresentation } from "@/helpers/keyboard/buildShortcut";

export interface IOverflowMenuItemProp {
  label: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  shortcut?: string;
  ShortcutRepresentation?: ShortcutRepresentation;
  onActionCallback?: () => void;
  id: ActionKeys;
}

export const OverflowMenuItem: React.FC<IOverflowMenuItemProp> = ({
  label,
  SVG, 
  shortcut,
  ShortcutRepresentation,
  onActionCallback, 
  id
}) => {
  const menuItemLabelId = `${id}-label`;
  const displayShortcut = shortcut && buildShortcutRepresentation(shortcut, ShortcutRepresentation, "+");
  
  return(
    <>
    <MenuItem 
      id={ id } 
      className={ overflowMenuStyles.menuItem } 
      aria-labelledby={ menuItemLabelId } 
      onAction={ onActionCallback }
    >
      <SVG aria-hidden="true" focusable="false" />
      <Text 
        className={ overflowMenuStyles.menuItemLabel } 
        slot="label"
        id={ menuItemLabelId }
      >
        { label }
      </Text>
    { displayShortcut && <Keyboard className={ overflowMenuStyles.menuItemKbdShortcut }>{ displayShortcut }</Keyboard> }
    </MenuItem>
    </>
  )
}