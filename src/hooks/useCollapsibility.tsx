import { useCallback, useEffect, useState } from "react";

import { IActionsItem } from "@/components/Actions";
import { ActionVisibility } from "@/components/Templates/ActionComponent";

import { useAppSelector } from "@/lib/hooks";
import { StaticBreakpoints } from "./useBreakpoints";
import { IActionPref, IDockingPref } from "@/preferences.interface";

// Smart keyword a placeholder for dynamic collapsibility 
// based on width available and not breakpoints 
export type Collapsibility = "smart" | { [key in StaticBreakpoints]?: number | "all" };

export const useCollapsibility = (items: IActionsItem[], prefs: IActionPref & IDockingPref) => {
  const [ActionIcons, setActionIcons] = useState<IActionsItem[]>([]);
  const [MenuItems, setMenuItems] = useState<IActionsItem[]>([]);
  const staticBreakpoint = useAppSelector(state => state.theming.staticBreakpoint);

  const triageActions = useCallback(() => {
    const actionIcons: IActionsItem[] = [];
    const menuItems: IActionsItem[] = [];

    let countdown: number = 0;
    if (prefs.collapse) {
      if (typeof prefs.collapse === "object") {
        if (staticBreakpoint) {
          const prefForBreakpoint = prefs.collapse[staticBreakpoint];
          if (prefForBreakpoint) {
            if (prefForBreakpoint === "all") {
              countdown = items.length;
            } else if (!isNaN(prefForBreakpoint) && prefForBreakpoint <= items.length) {
              countdown = prefForBreakpoint;
            }
          }
        }
      }
    }

    // Creating a shallow copy so that actionsOrder doesn’t mutate between rerenders
    [...items].slice().reverse().map((item) => {
      const actionPref = prefs.keys[item.key];
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
  }, [items, prefs, staticBreakpoint]);

  useEffect(() => {
    triageActions();
  }, [staticBreakpoint, triageActions]);

  return {
    ActionIcons,
    MenuItems
  }
}