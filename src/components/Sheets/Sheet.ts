import { RSPrefs } from "@/preferences";

import { BreakpointsMap, SheetPref, SheetTypes } from "@/models/sheets";
import { StaticBreakpoints } from "@/models/staticBreakpoints";

export const prefToMap = (pref?: SheetPref): Required<BreakpointsMap> => {
  const isValidType = (t: string) => {
    return Object.values(SheetTypes).includes(t as SheetTypes);
  };

  const breakpointsMap: Required<BreakpointsMap> = {
    [StaticBreakpoints.compact]: RSPrefs.actions.defaultSheet,
    [StaticBreakpoints.medium]: RSPrefs.actions.defaultSheet,
    [StaticBreakpoints.expanded]: RSPrefs.actions.defaultSheet,
    [StaticBreakpoints.large]: RSPrefs.actions.defaultSheet,
    [StaticBreakpoints.xLarge]: RSPrefs.actions.defaultSheet
  };

  if (typeof pref === "string" && isValidType(pref)) {
    for (const key in breakpointsMap) {
      Object.defineProperty(breakpointsMap, key, {
        value: pref
      })
    }
  } else if (typeof pref === "object") {
    Object.entries(pref).forEach(([ key, value ]) => {
      if (value && isValidType(value)) {
        Object.defineProperty(breakpointsMap, key, {
          value: value
        });
      }
    })
  };
  
  return breakpointsMap;
}