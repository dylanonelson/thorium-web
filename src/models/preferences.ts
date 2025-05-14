import { IActionPref } from "./actions";
import { IDockingPref } from "./docking";
import { Constraints, ILayoutDefaults, RSLayoutStrategy } from "./layout";
import { ISettingsSpacingPref, ISettingsTextPref, SettingsKeys, SettingsRangeVariant } from "./settings";
import { ShortcutRepresentation } from "@/packages/Helpers/keyboardUtilities";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { ThemeTokens } from "@/preferences/hooks/useTheming";
import { ScrollAffordancePref } from "@/packages/Hooks/Epub/scrollAffordance";
import { LayoutDirection, ScrollBackTo, ThemeKeys } from "@/preferences/preferences";

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
    breakpoints: BreakpointsMap<number | null>;
    themes: {
      reflowOrder: ThemeKeys[];
      fxlOrder: ThemeKeys[];
      keys: {
        [key in Exclude<ThemeKeys, ThemeKeys.auto>]: ThemeTokens;
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
    text?: ISettingsTextPref;
    spacing?: ISettingsSpacingPref;
  };
}