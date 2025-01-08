import { StaticBreakpoints } from "./hooks/useBreakpoints";
import { Collapsibility } from "./hooks/useCollapsibility";
import { ScrollAffordancePref, ScrollBackTo } from "./helpers/scrollAffordance";
import { ActionKeys, ActionVisibility } from "./components/Templates/ActionComponent";
import { Dockable, DockingKeys, SheetTypes } from "./components/Sheets/Sheet";
import { ShortcutRepresentation } from "./components/Shortcut";
import { ThemeKeys } from "./preferences";

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
  dockedWidth: number;
  keys: {
    [key in  DockingKeys]: IActionTokens;
  }
};

export interface IRSPrefs {
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