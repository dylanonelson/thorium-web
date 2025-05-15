import React, { ReactNode, RefObject } from "react";

import Locale from "../../resources/locales/en.json";

import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import MenuIcon from "./assets/icons/more_vert.svg";

import { CollapsibilityVisibility } from "@/packages/Components/Actions/hooks/useCollapsibility";
import { ThMenu } from "@/packages/Components/Menu/ThMenu";
import { ThActionsKeys, ThDockingKeys } from "@/preferences/models/enums";
import { StatefulActionIcon } from "./Triggers/StatefulActionIcon";

import { useAppDispatch } from "@/lib/hooks";
import { toggleImmersive } from "@/lib/readerReducer";
import { setOverflow } from "@/lib/actionsReducer";
import { ThActionEntry } from "@/packages/Components/Actions/ThCollapsibleActionsBar";

export interface StatefulOverflowMenuProps {
  id: string;
  items: ThActionEntry<ThActionsKeys | ThDockingKeys>[];
  triggerRef: RefObject<HTMLElement | null>;
  className?: string;
  actionFallback?: boolean;
  display: boolean;
  children?: ReactNode;
}

export const StatefulOverflowMenu = ({ 
  id,
  className, 
  actionFallback,
  display,
  items,
  triggerRef
}: StatefulOverflowMenuProps) => {
  const dispatch = useAppDispatch();

  const toggleMenuState = (value: boolean) => {
    dispatch(setOverflow({
      key: id,
      isOpen: value
    }));
  }

  if (items.length > 0 && (display)) {
    return (
      <>
      <ThMenu 
        id={ id }
        triggerRef={ triggerRef }
        selectionMode="none" 
        className={ overflowMenuStyles.overflowMenu }
        dependencies={ ["Trigger"] }
        items={ items }
        compounds={{
          trigger: {
            onOpenChange: (val) => toggleMenuState(val)
          },
          popover: {
            placement: "bottom",
            className: overflowMenuStyles.overflowPopover
          },
          button: (
            <StatefulActionIcon
              className={ className ? className : overflowMenuStyles.activeButton }
              aria-label={ Locale.reader.overflowMenu.active.trigger }
              placement="bottom"
              tooltipLabel={ Locale.reader.overflowMenu.active.tooltip }
              visibility={ CollapsibilityVisibility.always }
            >
              <MenuIcon aria-hidden="true" focusable="false" />
            </StatefulActionIcon>
          ),
        }}
      />
      </>
    )
  } else {
    if (actionFallback) {
      return(
        <>
        <StatefulActionIcon 
          className={ className ? className : overflowMenuStyles.hintButton } 
          aria-label={ Locale.reader.overflowMenu.hint.trigger }
          placement="bottom"
          tooltipLabel={ Locale.reader.overflowMenu.hint.tooltip } 
          visibility={ CollapsibilityVisibility.always }
          onPress={ () => { dispatch(toggleImmersive()) } }
          preventFocusOnPress={ true }
        >
          <MenuIcon aria-hidden="true" focusable="false" />
        </StatefulActionIcon>
      </>
      )
    } else {
      return(<></>)
    }
  }
}