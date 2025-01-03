import { useCallback, useEffect, useState } from "react";

import { IActionItem } from "@/components/Actions";
import { ActionVisibility } from "@/components/Templates/ActionComponent";

import { useAppSelector } from "@/lib/hooks";
import { StaticBreakpoints } from "./useBreakpoints";

// Smart keyword a placeholder for dynamic collapsibility 
// based on width available and not breakpoints 
export type Collapsibility = "smart" & { [key in StaticBreakpoints]?: number };

export const useCollapsibility = (items: IActionItem[], prefs: any) => {
  const [ActionIcons, setActionIcons] = useState<IActionItem[]>([]);
  const [MenuItems, setMenuItems] = useState<IActionItem[]>([]);
  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);

  const triageActions = useCallback(() => {
    const actionIcons: IActionItem[] = [];
    const menuItems: IActionItem[] = [];

    let countdown: number = staticBreakpoint ? prefs.collapsibility[staticBreakpoint] : 0;

    // Creating a shallow copy so that actionsOrder doesn’t mutate between rerenders
    [...items].slice().reverse().map((item) => {
      const actionPref = prefs[item.key];
      if (actionPref.visibility === ActionVisibility.overflow) {
        menuItems.unshift(item);
      } else if (actionPref.visibility === ActionVisibility.partially) {
          if (countdown > 0) {
            menuItems.unshift(item);
            --countdown;
          } else {
            actionIcons.unshift(item);
          }
      } else {
        actionIcons.unshift(item);
      }
    });

    setActionIcons(actionIcons);
    setMenuItems(menuItems);
  }, [staticBreakpoint]);

  useEffect(() => {
    triageActions();
  }, [staticBreakpoint, triageActions]);

  return {
    ActionIcons,
    MenuItems
  }
}