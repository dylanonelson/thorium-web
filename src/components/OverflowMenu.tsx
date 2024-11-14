import React, { ReactNode } from "react";

import { ActionVisibility } from "@/preferences";

import Locale from "../resources/locales/en.json";
import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import MenuIcon from "./assets/icons/menu.svg";

import { Key, Menu, MenuTrigger, Popover } from "react-aria-components";
import { ActionIcon } from "./Templates/ActionIcon";
import { useAppDispatch } from "@/lib/hooks";
import { setOverflowMenuOpen } from "@/lib/readerReducer";

export const OverflowMenu = ({ children }: { children?: ReactNode }) => {
  const dispatch = useAppDispatch();

  const toggleMenuState = (value: boolean) => {
    dispatch(setOverflowMenuOpen(value));
  }
  
  return(
    <>
    { children ? 
      <>
      <MenuTrigger onOpenChange={ (val) => toggleMenuState(val) }>
        <ActionIcon 
          ariaLabel={ Locale.reader.overflowMenu.trigger }
          SVG={ MenuIcon} 
          placement="bottom"
          tooltipLabel={ Locale.reader.overflowMenu.tooltip } 
          visibility={ ActionVisibility.always }
        />
        <Popover
          placement="bottom"
          className={ overflowMenuStyles.overflowPopover }
        >
          <Menu 
            selectionMode="none" 
            onAction={ (key: Key) => { console.log(key) } 
            
          }>
            { children }
          </Menu>
        </Popover>
      </MenuTrigger>
      </>
      : <></>
    }
    </>
  )
}