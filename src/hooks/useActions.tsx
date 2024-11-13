import React, { useEffect, useState } from "react";

import { ActionKeys, ActionVisibility, RSPrefs } from "@/preferences";

import { Links } from "@readium/shared";

import { FullscreenActionIcon, FullscreenMenuItem } from "@/components/FullscreenAction";
import { JumpToPositionActionIcon, JumpToPositionMenuItem } from "@/components/JumpToPositionAction";
import { SettingsActionIcon, SettingsMenuItem } from "@/components/SettingsAction";
import { TocActionIcon, TocMenuItem } from "@/components/TocAction";
import { useAppSelector } from "@/lib/hooks";

export const useActions = (toc: Links) => {
  const [ActionIcons, setActionIcons] = useState<React.JSX.Element[]>([]);
  const [MenuItems, setMenuItems] = useState<React.JSX.Element[]>([]);
  const hasReachedBreakpoint = useAppSelector(state => state.reader.hasReachedBreakpoint);

  const ActionIconsMap = {
    [ActionKeys.fullscreen]: <FullscreenActionIcon />,
    [ActionKeys.jumpToPosition]: <JumpToPositionActionIcon />,
    [ActionKeys.settings]: <SettingsActionIcon />,
    [ActionKeys.toc]: <TocActionIcon toc={ toc } />
  };

  const MenuItemsMap = {
    [ActionKeys.fullscreen]: <FullscreenMenuItem />,
    [ActionKeys.jumpToPosition]: <JumpToPositionMenuItem />,
    [ActionKeys.settings]: <SettingsMenuItem />,
    [ActionKeys.toc]: <TocMenuItem toc={ toc } />
  };

  const actionsOrder = RSPrefs.actions.displayOrder;

  const triageActions = () => {
    const actionIcons: React.JSX.Element[] = [];
    const menuItems: React.JSX.Element[] = [];

    actionsOrder.map((key) => {
      switch(RSPrefs.actions[key].visibility) {
        case ActionVisibility.always:
        case ActionVisibility.partially:
          actionIcons.push(ActionIconsMap[key]);
          break;
        case ActionVisibility.collapsible:
          if (hasReachedBreakpoint) {
            actionIcons.push(ActionIconsMap[key]);
          } else {
            menuItems.push(MenuItemsMap[key]);
          }
          break;
        case ActionVisibility.overflow:
        default:
          menuItems.push(MenuItemsMap[key]);
          break;
      }
    });

    setActionIcons(actionIcons);
    setMenuItems(menuItems);
  };

  useEffect(() => {
    triageActions();
  }, [hasReachedBreakpoint]);

  return {
    ActionIcons,
    MenuItems
  }
}