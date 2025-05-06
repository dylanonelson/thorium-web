import React from "react";

import Locale from "../resources/locales/en.json";

import { ActionVisibility, IOverflowMenu } from "@/models/actions";

import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import MenuIcon from "./assets/icons/more_vert.svg";

import { ThMenu } from "@/packages/Components";
import { ActionIcon } from "./ActionTriggers/ActionIcon";

import { useAppDispatch } from "@/lib/hooks";
import { toggleImmersive } from "@/lib/readerReducer";
import { setOverflow } from "@/lib/actionsReducer";

export const OverflowMenu = ({ 
  id,
  className, 
  actionFallback,
  display,
  actionItems,
  triggerRef
}: IOverflowMenu) => {
  const dispatch = useAppDispatch();

  const toggleMenuState = (value: boolean) => {
    dispatch(setOverflow({
      key: id,
      isOpen: value
    }));
  }

  if (actionItems.length > 0 && (display)) {
    return (
      <>
      <ThMenu 
        id={ id }
        triggerRef={ triggerRef }
        selectionMode="none" 
        className={ overflowMenuStyles.overflowMenu }
        dependencies={ ["Trigger"] }
        items={ actionItems }
        compounds={{
          trigger: {
            onOpenChange: (val) => toggleMenuState(val)
          },
          popover: {
            placement: "bottom",
            className: overflowMenuStyles.overflowPopover
          },
          button: (
            <ActionIcon
              className={ className ? className : overflowMenuStyles.activeButton }
              aria-label={ Locale.reader.overflowMenu.active.trigger }
              placement="bottom"
              tooltipLabel={ Locale.reader.overflowMenu.active.tooltip }
              visibility={ ActionVisibility.always }
            >
              <MenuIcon aria-hidden="true" focusable="false" />
            </ActionIcon>
          ),
        }}
      />
      </>
    )
  } else {
    if (actionFallback) {
      return(
        <>
        <ActionIcon 
          className={ className ? className : overflowMenuStyles.hintButton } 
          aria-label={ Locale.reader.overflowMenu.hint.trigger }
          placement="bottom"
          tooltipLabel={ Locale.reader.overflowMenu.hint.tooltip } 
          visibility={ ActionVisibility.always }
          onPress={ () => { dispatch(toggleImmersive()) } }
          preventFocusOnPress={ true }
        >
          <MenuIcon aria-hidden="true" focusable="false" />
        </ActionIcon>
      </>
      )
    } else {
      return(<></>)
    }
  }
}