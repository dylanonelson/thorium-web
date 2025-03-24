import { IActionPref } from "./actions";
import { IDockingPref } from "./docking";
import { Constraints, ILayoutDefaults, LayoutDirection, ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "./layout";
import { ISettingsRangePref, SettingsKeys, SettingsRangeVariant, SpacingSettingsKeys, TextSettingsKeys } from "./settings";
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
  direction?: LayoutDirection,
  locale?: string;
  typography: {
    minimalLineLength?: number | null;
    maximalLineLength?: number | null;
    optimalLineLength: number;
    pageGutter: number;
    layoutStrategy?: RSLayoutStrategy | null;
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
      tooltipDelay?: number;
    };
    icon: {
      size: number;
      tooltipOffset: number;
      tooltipDelay?: number;
    };
    layout: {
      radius: number;
      spacing: number;
      defaults: ILayoutDefaults;
      constraints?: {
        [key in Constraints]?: number
      }
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
  settings: {
    reflowOrder: SettingsKeys[];
    fxlOrder: SettingsKeys[];
    zoom?: {
      variant?: SettingsRangeVariant;
    };
    text?: {
      main?: TextSettingsKeys[];
      displayOrder?: TextSettingsKeys[];
    };
    spacing?: {
      main?: SpacingSettingsKeys[];
      displayOrder?: SpacingSettingsKeys[];
      letterSpacing?: ISettingsRangePref;
      lineHeight?: {
        [key in Exclude<ReadingDisplayLineHeightOptions, ReadingDisplayLineHeightOptions.publisher>]: number
      };
      paraIndent?: ISettingsRangePref;
      paraSpacing?: ISettingsRangePref;
      wordSpacing?: ISettingsRangePref;
    };
  };
}