import React, { ComponentType, SVGProps } from "react";

import overflowMenuStyles from "../assets/styles/overflowMenu.module.css";

import { Keyboard, MenuItem, MenuItemProps, Text } from "react-aria-components";

import { useAppSelector } from "@/lib/hooks";
import parseTemplate from "json-templates";
import { OverflowMenuKeys } from "../OverflowMenu";

export interface IOverflowMenuItemProp {
  label: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  shortcut?: string;
  onActionCallback?: () => void;
  id: OverflowMenuKeys;
}

export const OverflowMenuItem = ({
  label,
  SVG, 
  shortcut,
  onActionCallback, 
  id
}: IOverflowMenuItemProp) => {
  
  const buildShortcut = () => {
    if (shortcut) {
      const jsonTemplate = parseTemplate(shortcut);
      const platformModifier = useAppSelector(state => state.reader.platformModifier);
      return jsonTemplate({ PlatformKey: platformModifier.icon });
    }
    return undefined;
  };
  
  return(
    <>
    <MenuItem id={ id } className={ overflowMenuStyles.menuItem } onAction={ onActionCallback }>
      <SVG aria-hidden="true" focusable="false" />
      <Text className={ overflowMenuStyles.menuItemLabel } slot="label">{ label }</Text>
    { shortcut && <Keyboard className={ overflowMenuStyles.menuItemKbdShortcut }>{ buildShortcut() }</Keyboard> }
    </MenuItem>
    </>
  )
}