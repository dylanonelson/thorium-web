import { ActionKeys, ActionVisibility } from "./actions";
import { SheetTypes } from "./sheets";
import { Dockable, DockingKeys } from "./docking";
import { ShortcutRepresentation } from "./shortcut";
import { StaticBreakpoints } from "./staticBreakpoints";

export enum LayoutDirection {
  ltr = "ltr",
  rtl = "rtl"
}

export enum ColorScheme {
  light = "light",
  dark = "dark"
}

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

export type Collapsibility = boolean | { [key in StaticBreakpoints]?: number | "all" };

export enum ThemeKeys {
  auto = "auto",
  light = "light",
  sepia = "sepia",
  dark = "dark",
  paper = "paper",
  contrast1 = "contrast1",
  contrast2 = "contrast2",
  contrast3 = "contrast3"
}

export interface IThemeTokens {
  background: string;
  text: string;
  link: string;
  visited: string;
  subdue: string;
  disable: string;
  hover: string;
  onHover: any;
  select: string;
  onSelect: string;
  focus: string;
  elevate: string;
  immerse: string;
};

export interface IActionTokens {
  visibility: ActionVisibility;
  shortcut: string | null;
  sheet?: {
    [key in StaticBreakpoints]?: SheetTypes;
  };
  dockable?: Dockable;
};

export interface IActionPref {
  displayOrder: ActionKeys[];
  collapse: Collapsibility;
  defaultSheet: SheetTypes;
  keys: {
    [key in ActionKeys]: IActionTokens;
  }
};

export interface IDockingPref {
  displayOrder: DockingKeys[];
  collapse: Collapsibility;
  defaultWidth: number;
  keys: {
    [key in  DockingKeys]: IActionTokens;
  }
};

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