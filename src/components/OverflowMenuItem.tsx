import React, { ComponentType, SVGProps } from "react";

import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import { Keyboard, MenuItem, Text } from "react-aria-components";

export interface IOverflowMenuItemProp {
  SVG: ComponentType<SVGProps<SVGElement>>;
  label: string;
  shortcut: string;
  onActionCallback: () => void;
}

export const OverflowMenuItem = ({
  SVG,
  label,
  shortcut,
  onActionCallback
}: IOverflowMenuItemProp) => {
  return(
    <>
      <MenuItem className={ overflowMenuStyles.menuItem } onAction={ onActionCallback }>
        <SVG aria-hidden="true" focusable="false" />
        <Text className={ overflowMenuStyles.menuItemLabel } slot="label">{ label }</Text>
        <Keyboard className={ overflowMenuStyles.menuItemKbdShortcut }>{ shortcut }</Keyboard>
      </MenuItem>
    </>
  )
}