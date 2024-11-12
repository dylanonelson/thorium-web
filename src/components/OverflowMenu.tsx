import React, { ReactNode } from "react";

import Locale from "../resources/locales/en.json";
import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import MenuIcon from "./assets/icons/menu.svg";

import { Menu, MenuTrigger, Popover } from "react-aria-components";
import { ActionIcon } from "./Templates/ActionIcon";

export const OverflowMenu = ({ children }: { children?: ReactNode }) => {
  return(
    <>
    { children ? 
      <MenuTrigger>
        <ActionIcon 
          ariaLabel={ Locale.reader.overflowMenu.trigger }
          SVG={ MenuIcon} 
          placement="bottom"
          tooltipLabel={ Locale.reader.overflowMenu.tooltip } 
        />
        <Popover
          placement="bottom"
          className={ overflowMenuStyles.overflowPopover }
        >
          <Menu selectionMode="none">
            { children }
          </Menu>
        </Popover>
      </MenuTrigger>
      : <></>
    }
    </>
  )
}