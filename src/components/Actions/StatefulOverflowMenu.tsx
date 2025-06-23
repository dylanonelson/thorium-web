"use client";

import React, { ReactNode, RefObject } from "react";

import Locale from "../../resources/locales/en.json";

import overflowMenuStyles from "./assets/styles/overflowMenu.module.css";

import MenuIcon from "./assets/icons/more_vert.svg";

import { ThCollapsibilityVisibility } from "@/core/Components/Actions/hooks/useCollapsibility";
import { ThMenu } from "@/core/Components/Menu/ThMenu";
import { ThActionsKeys, ThDockingKeys } from "@/preferences/models/enums";
import { StatefulActionIcon } from "./Triggers/StatefulActionIcon";

import { useAppDispatch } from "@/lib/hooks";
import { toggleImmersive } from "@/lib/readerReducer";
import { setOverflow } from "@/lib/actionsReducer";
import { ThActionEntry } from "@/core/Components/Actions/ThActionsBar";

import classNames from "classnames";

export interface StatefulOverflowMenuProps {
  id: string;
  items: ThActionEntry<string | ThActionsKeys | ThDockingKeys>[];
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
          menuTrigger: {
            onOpenChange: (val: boolean) => toggleMenuState(val)
          },
          popover: {
            placement: "bottom",
            className: overflowMenuStyles.overflowPopover
          },
          button: (
            <StatefulActionIcon
              className={ classNames(className, overflowMenuStyles.activeButton) }
              aria-label={ Locale.reader.overflowMenu.active.trigger }
              placement="bottom"
              tooltipLabel={ Locale.reader.overflowMenu.active.tooltip }
              visibility={ ThCollapsibilityVisibility.always }
            >
              <MenuIcon aria-hidden="true" focusable="false" />
            </StatefulActionIcon>
          ),
        }}
      />
      </>
    )
  } else if (actionFallback) {
    return(
      <>
      <StatefulActionIcon 
        className={ classNames(className, overflowMenuStyles.hintButton) } 
        aria-label={ Locale.reader.overflowMenu.hint.trigger }
        placement="bottom"
        tooltipLabel={ Locale.reader.overflowMenu.hint.tooltip } 
        visibility={ ThCollapsibilityVisibility.always }
        onPress={ () => dispatch(toggleImmersive()) }
        preventFocusOnPress={ true }
      >
        <MenuIcon aria-hidden="true" focusable="false" />
      </StatefulActionIcon>
    </>
    )
  }
}