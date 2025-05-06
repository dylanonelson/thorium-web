"use client";

import { useCallback, useEffect, useState } from "react";

import { ThMenuEntry } from "@/packages/Components";

export type Collapsibility = boolean | Record<string, number | "all">;

export enum CollapsibilityVisibility {
  always = "always",
  partially = "partially",
  overflow = "overflow"
}

export interface CollapsiblePref {
  displayOrder: string[];
  collapse: Collapsibility;
  keys: {
    [key: string]: {
      [key: string]: any;
      visibility: CollapsibilityVisibility;
    };
  }
}

export const useCollapsibility = (items: ThMenuEntry<string>[], prefs: CollapsiblePref, breakpoint?: string) => {
  const [ActionIcons, setActionIcons] = useState<ThMenuEntry<string>[]>([]);
  const [MenuItems, setMenuItems] = useState<ThMenuEntry<string>[]>([]);

  const triageActions = useCallback(() => {
    const actionIcons: ThMenuEntry<string>[] = [];
    const menuItems: ThMenuEntry<string>[] = [];

    let countdown: number = 0;

    if (prefs.collapse) {
      // Handling number of items to collapse
      if (typeof prefs.collapse === "object" && !(prefs.collapse instanceof Boolean)) {
        if (breakpoint) {
          const prefForBreakpoint = prefs.collapse[breakpoint];
          if (prefForBreakpoint) {
            if (prefForBreakpoint === "all") {
              countdown = 0;
            } else if (!isNaN(prefForBreakpoint)) {
              if (prefForBreakpoint === items.length) {
                countdown = 0;
              } else if (prefForBreakpoint < items.length) {
                // We must take the overflow icon into account so that
                // it doesn’t contain only one partially visible item 
                countdown = items.length - (prefForBreakpoint - 1);
              }
            }
          }
        }
      }

      // Creating a shallow copy so that actionsOrder doesn’t mutate between rerenders
      [...items].slice().reverse().map((item) => {
        const actionPref = prefs.keys[item.key];
        if (actionPref.visibility === CollapsibilityVisibility.overflow) {
          menuItems.unshift(item);
          --countdown;
        } else if (actionPref.visibility === CollapsibilityVisibility.partially) {
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
    } else {
      // collapse set to false so we ignore visibility and don’t triage
      items.map((item) => {
        actionIcons.push(item);
      });
    }

    setActionIcons(actionIcons);
    setMenuItems(menuItems);
  }, [items, prefs, breakpoint]);

  useEffect(() => {
    triageActions();
  }, [breakpoint, triageActions, items, prefs]);

  return {
    ActionIcons,
    MenuItems
  }
}