import { ReactElement, ReactNode } from "react";

import { RSPrefs } from "@/preferences";

import { IActionIconProps } from "../Templates/ActionIcon";
import { StaticBreakpoints } from "@/hooks/useBreakpoints";

export enum SheetTypes {
  popover = "popover",
  fullscreen = "fullscreen"
}

export type BreakpointsMap = {
  [key in StaticBreakpoints]?: SheetTypes;
}

export interface ISheet {
  renderActionIcon: () => ReactElement<IActionIconProps>;
  className: string;
  isOpen: boolean;
  onOpenChangeCallback: (isOpen: boolean) => void;
  closeLabel: string;
  onClosePressCallback: () => void;
  children?: ReactNode;
}

export type SheetPref = SheetTypes | BreakpointsMap;

export const prefToMap = (pref: SheetPref): Required<BreakpointsMap> => {
  const isValidType = (t: string) => {
    // @ts-ignore
    return Object.values(SheetTypes).includes(t);
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