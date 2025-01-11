import { IActionPref } from "./actions";
import { IDockingPref } from "./docking";
import { LayoutDirection } from "./layout";
import { ShortcutRepresentation } from "./shortcut";
import { StaticBreakpoints } from "./staticBreakpoints";
import { IThemeTokens, ThemeKeys } from "./theme";

export enum ScrollAffordancePref {
  none = "none",
  prev = "previous",
  next = "next",
  both = "both"
}

export enum ScrollBackTo {
  top = "top",
  bottom = "bottom",
  untouched = "untouched"
}

export interface IRSPrefs {
  direction: LayoutDirection,
  typography: {
    minimalLineLength?: number | null;
    optimalLineLength: number;
    pageGutter: number;
  };
  scroll: {
    topAffordance: ScrollAffordancePref;
    bottomAffordance: ScrollAffordancePref;
    backTo: ScrollBackTo;
  };
  theming: {
    arrow: {
      size: number;
      offset: number;
    };
    icon: {
      size: number;
      tooltipOffset: number;
    };
    layout: {
      radius: number;
      spacing: number;
    };
    breakpoints: {
      [key in StaticBreakpoints]: number | null;
    };
    themes: {
      reflowOrder: ThemeKeys[];
      fxlOrder: ThemeKeys[];
      keys: {
        [key in Exclude<ThemeKeys, ThemeKeys.auto>]: IThemeTokens;
      }
    };
  };
  shortcuts: {
    representation: ShortcutRepresentation;
    joiner?: string;
  };
  actions: IActionPref;
  docking: IDockingPref;
}