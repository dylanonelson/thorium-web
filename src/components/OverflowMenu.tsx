import React from "react";

import { RSPrefs } from "../preferences";

import Locale from "../resources/locales/en.json";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";
import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import MenuIcon from "./assets/icons/menu.svg";
import TargetIcon from "./assets/icons/target-icon.svg";

import { Menu, MenuTrigger, Popover, Text } from "react-aria-components";
import { ActionIcon } from "./ActionIcon";
import { OverflowMenuItem } from "./OverflowMenuItem";

import parseTemplate from "json-templates";
import { useAppSelector } from "@/lib/hooks";

export const OverflowMenu = () => {
  const jsonTemplate = parseTemplate(RSPrefs.shortcuts.jumpToPosition);
  const platformModifier = useAppSelector(state => state.reader.platformModifier);

  return(
    <>
    <MenuTrigger>
      <ActionIcon 
        className={ readerSharedUI.icon } 
        ariaLabel={ Locale.reader.overflowMenu.trigger }
        SVG={ MenuIcon} 
        placement="bottom"
        tooltipLabel={ Locale.reader.overflowMenu.label } 
      />
      <Popover
        placement="bottom"
        className={ overflowMenuStyles.overflowPopover }
      >
        <Menu>
          <OverflowMenuItem
            SVG={ TargetIcon } 
            label={ Locale.reader.jumpToPosition.label }
            shortcut={ jsonTemplate({ PlatformKey: platformModifier.icon }) } 
            onActionCallback={ () => {} }
          />
        </Menu>
      </Popover>
    </MenuTrigger>
    </>
  )
}