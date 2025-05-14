import { ShortcutRepresentation } from "@/packages/Helpers/keyboardUtilities";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { ThemeTokens } from "@/preferences/hooks/useTheming";
import { ScrollAffordancePref } from "@/packages/Hooks/Epub/scrollAffordance";
import { ILayoutDefaults } from "@/models/layout";
import { IActionPref } from "@/models/actions";
import { IDockingPref } from "@/models/docking";
import { ISettingsSpacingPref, ISettingsTextPref, SettingsRangeVariant } from "@/models/settings";

export enum ActionKeys {
  fullscreen = "fullscreen",
  jumpToPosition = "jumpToPosition",
  layoutStrategy = "layoutStrategy",
  settings = "settings",
  toc = "toc"
}

export enum DockingKeys {
  start = "dockingStart",
  end = "dockingEnd",
  transient = "dockingTransient"
}

export enum DockingTypes {
  none = "none",
  both = "both",
  start = "start",
  end = "end"
}

export enum ScrollBackTo {
  top = "top",
  bottom = "bottom",
  untouched = "untouched"
}

export enum SettingsKeys {
  align = "align",
  columns = "columns",
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  layout = "layout",
  letterSpacing = "letterSpacing",
  lineHeight = "lineHeight",
  normalizeText = "normalizeText",
  paraIndent = "paraIndent",
  paraSpacing = "paraSpacing",
  publisherStyles = "publisherStyles",
  spacing = "spacing",
  text = "text",
  theme = "theme",
  wordSpacing = "wordSpacing",
  zoom = "zoom"
}

export enum SheetTypes {
  popover = "popover",
  fullscreen = "fullscreen",
  dockedStart = "docked start",
  dockedEnd = "docked end",
  bottomSheet = "bottomSheet"
}

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

export enum ThLayoutDirection {
  rtl = "rtl",
  ltr = "ltr"
}

export enum ThLayoutStrategy {
  margin = "margin",
  lineLength = "lineLength",
  columns = "columns"
}

export type ConstraintKeys = Extract<SheetTypes, SheetTypes.bottomSheet | SheetTypes.popover>;

export interface ThPreferences<
  CustomThemeKeys extends string | number | symbol = ThemeKeys,
  CustomConstraintsKeys extends string | number | symbol = ConstraintKeys,
  CustomSettingsKeys extends string | number | symbol = SettingsKeys
> {
  direction?: ThLayoutDirection,
  locale?: string;
  typography: {
    minimalLineLength?: number | null;
    maximalLineLength?: number | null;
    optimalLineLength: number;
    pageGutter: number;
    layoutStrategy?: ThLayoutStrategy | null;
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
        [key in CustomConstraintsKeys]?: number
      }
    };
    breakpoints: BreakpointsMap<number | null>;
    themes: {
      reflowOrder: CustomThemeKeys[];
      fxlOrder: CustomThemeKeys[];
      keys: {
        [key in Exclude<CustomThemeKeys, "auto">]: ThemeTokens;
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
    reflowOrder: CustomSettingsKeys[];
    fxlOrder: CustomSettingsKeys[];
    zoom?: {
      variant?: SettingsRangeVariant;
    };
    text?: ISettingsTextPref;
    spacing?: ISettingsSpacingPref;
  };
}

// TODO: Helpers to createPreferences and mergePreferences