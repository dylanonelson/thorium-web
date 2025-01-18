import React from "react";

import Locale from "../resources/locales/en.json";

import { ActionVisibility, IOverflowMenu } from "@/models/actions";

import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import MenuIcon from "./assets/icons/more_vert.svg";

import { Key, Menu, MenuTrigger, Popover } from "react-aria-components";
import { ActionIcon } from "./Templates/ActionIcon";

import { useAppDispatch } from "@/lib/hooks";
import { toggleImmersive } from "@/lib/readerReducer";
import { setOverflow } from "@/lib/actionsReducer";

export const OverflowMenu = ({ 
    id,
    className, 
    actionFallback,
    display,
    children 
  }: IOverflowMenu) => {
  const dispatch = useAppDispatch();

  const toggleMenuState = (value: boolean) => {
    dispatch(setOverflow({
      key: id,
      isOpen: value
    }));
  }

  if (React.Children.toArray(children).length > 0 && (display)) {
    return (
      <>
      <MenuTrigger onOpenChange={ (val) => toggleMenuState(val) }>
        <ActionIcon 
          className={ className ? className : overflowMenuStyles.activeButton }
          ariaLabel={ Locale.reader.overflowMenu.active.trigger }
          SVG={ MenuIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.overflowMenu.active.tooltip } 
          visibility={ ActionVisibility.always }
        />
        <Popover
          placement="bottom"
          className={ overflowMenuStyles.overflowPopover }
        >
          <Menu 
            id={ id }
            selectionMode="none" 
            onAction={ (key: Key) => { console.log(key) } } 
            className={ overflowMenuStyles.overflowMenu }
          >
            { children }
          </Menu>
        </Popover>
      </MenuTrigger>
      </>
    )
  } else {
    if (actionFallback) {
      return(
        <>
        <ActionIcon 
          className={ className ? className : overflowMenuStyles.hintButton } 
          ariaLabel={ Locale.reader.overflowMenu.hint.trigger }
          SVG={ MenuIcon } 
          placement="bottom"
          tooltipLabel={ Locale.reader.overflowMenu.hint.tooltip } 
          visibility={ ActionVisibility.always }
          onPressCallback={ () => { dispatch(toggleImmersive()) } }
          preventFocusOnPress={ true }
        />
      </>
      )
    } else {
      return(<></>)
    }
  }
}