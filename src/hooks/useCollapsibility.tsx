import React, { useCallback, useEffect, useState } from "react";

import { RSPrefs } from "@/preferences";

import { Links } from "@readium/shared";

import { FullscreenAction } from "@/components/FullscreenAction";
import { JumpToPositionAction } from "@/components/JumpToPositionAction";
import { SettingsAction } from "@/components/SettingsAction";
import { TocModalAction } from "@/components/TocModalAction";
import { useAppSelector } from "@/lib/hooks";
import { ActionComponentVariant, ActionKeys, ActionVisibility } from "@/components/Templates/ActionComponent";

export const useCollapsibility = () => {
  const [ActionIcons, setActionIcons] = useState<React.JSX.Element[]>([]);
  const [MenuItems, setMenuItems] = useState<React.JSX.Element[]>([]);
  const hasReachedBreakpoint = useAppSelector(state => state.reader.hasReachedBreakpoint);

  const triageActions = useCallback(() => {
    const ActionIconsMap = {
      [ActionKeys.fullscreen]: <FullscreenAction key={ ActionKeys.fullscreen } variant={ ActionComponentVariant.button } />,
      [ActionKeys.jumpToPosition]: <JumpToPositionAction key={ ActionKeys.jumpToPosition } variant={ ActionComponentVariant.button } />,
      [ActionKeys.settings]: <SettingsAction key={ ActionKeys.settings } variant={ ActionComponentVariant.button } />,
      [ActionKeys.toc]: <TocModalAction key={ ActionKeys.toc } variant={ ActionComponentVariant.button } />
    };
  
    const MenuItemsMap = {
      [ActionKeys.fullscreen]: <FullscreenAction key={ ActionKeys.fullscreen } variant={ ActionComponentVariant.menu } />,
      [ActionKeys.jumpToPosition]: <JumpToPositionAction key={ ActionKeys.jumpToPosition } variant={ ActionComponentVariant.menu } />,
      [ActionKeys.settings]: <SettingsAction key={ ActionKeys.settings } variant={ ActionComponentVariant.menu } />,
      [ActionKeys.toc]: <TocModalAction key={ ActionKeys.toc } variant={ ActionComponentVariant.menu } />
    };
  
    const actionsOrder = RSPrefs.actions.displayOrder;
  
    const actionIcons: React.JSX.Element[] = [];
    const menuItems: React.JSX.Element[] = [];

    actionsOrder.map((key) => {
      const actionPref = RSPrefs.actions[key];
      if (actionPref.visibility === ActionVisibility.overflow) {
        menuItems.push(MenuItemsMap[key]);
      } else if (actionPref.collapsible) {
        if (hasReachedBreakpoint) {
          actionIcons.push(ActionIconsMap[key]);
        } else {
          menuItems.push(MenuItemsMap[key]);
        }
      } else {
        actionIcons.push(ActionIconsMap[key]);
      }
    });

    setActionIcons(actionIcons);
    setMenuItems(menuItems);
  }, [hasReachedBreakpoint]);

  useEffect(() => {
    triageActions();
  }, [hasReachedBreakpoint, triageActions]);

  return {
    ActionIcons,
    MenuItems
  }
}