import React, { ComponentType, SVGProps } from "react";

import Peripherals, { ShortcutMetaKeysTemplates } from "@/helpers/peripherals";
import { ActionKeys } from "@/preferences";

import overflowMenuStyles from "../assets/styles/overflowMenu.module.css";

import { Keyboard, MenuItem, Text } from "react-aria-components";

import { useAppSelector } from "@/lib/hooks";
import parseTemplate from "json-templates";

export interface IOverflowMenuItemProp {
  label: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  shortcut?: string;
  shortcutForm?: "icon" | "longform" | "shortform";
  onActionCallback?: () => void;
  id: ActionKeys;
}

export const OverflowMenuItem: React.FC<IOverflowMenuItemProp> = ({
  label,
  SVG, 
  shortcut,
  shortcutForm,
  onActionCallback, 
  id
}) => {
  const platformModifier = useAppSelector(state => state.reader.platformModifier);
  
  const buildShortcut = (form: string = "icon") => {
    if (shortcut) {
      const jsonTemplate = parseTemplate(shortcut);
      const key = Peripherals.handleJSONTemplating(ShortcutMetaKeysTemplates.platform);
      return jsonTemplate({ [key]: platformModifier[form] });
    }
    return undefined;
  };
  
  return(
    <>
    <MenuItem id={ id } className={ overflowMenuStyles.menuItem } onAction={ onActionCallback }>
      <SVG aria-hidden="true" focusable="false" />
      <Text className={ overflowMenuStyles.menuItemLabel } slot="label">{ label }</Text>
    { shortcut && <Keyboard className={ overflowMenuStyles.menuItemKbdShortcut }>{ buildShortcut(shortcutForm) }</Keyboard> }
    </MenuItem>
    </>
  )
}