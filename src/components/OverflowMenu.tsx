import React, { ReactNode } from "react";

import Locale from "../resources/locales/en.json";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";
import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import MenuIcon from "./assets/icons/menu.svg";

import { Menu, MenuTrigger, Popover } from "react-aria-components";
import { ActionIcon } from "./templateComponents/ActionIcon";

export const OverflowMenu = ({ children }: { children?: ReactNode }) => {
  return(
    <>
    { children ? 
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
            { children }
          </Menu>
        </Popover>
      </MenuTrigger>
      : <></>
    }
    </>
  )
}