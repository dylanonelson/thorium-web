import { ShortcutRepresentation } from "@/packages/Helpers/keyboardUtilities";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { ThemeTokens } from "@/preferences/hooks/useTheming";
import { ScrollAffordancePref } from "@/packages/Hooks/Epub/scrollAffordance";
import { ILayoutDefaults, ReadingDisplayLineHeightOptions } from "@/models/layout";
import { IActionPref } from "@/models/actions";
import { IDockingPref } from "@/models/docking";
import { ISettingsRangePref, ISettingsGroupPref, SettingsRangeVariant } from "@/models/settings";
import { ScrollBackTo, SettingsKeys, SheetTypes, ThemeKeys, ThLayoutDirection, ThLayoutStrategy } from "./models/enums";

export type SettingsKeyTypes = {
  [SettingsKeys.letterSpacing]?: ISettingsRangePref;
  [SettingsKeys.lineHeight]?: {
      [key in Exclude<ReadingDisplayLineHeightOptions, ReadingDisplayLineHeightOptions.publisher>]: number
    };
  [SettingsKeys.paraIndent]?: ISettingsRangePref;
  [SettingsKeys.paraSpacing]?: ISettingsRangePref;
  [SettingsKeys.wordSpacing]?: ISettingsRangePref;
  [SettingsKeys.zoom]?: {
    variant?: SettingsRangeVariant;
  };
}

export type ConstraintKeys = Extract<SheetTypes, SheetTypes.bottomSheet | SheetTypes.popover>;

export interface ThPreferences<
  CustomThemeKeys extends string | number | symbol = ThemeKeys,
  CustomConstraintsKeys extends string | number | symbol = ConstraintKeys,
  CustomSettingsKeys extends string | number | symbol = SettingsKeys,
  CustomSettingsKeyTypes extends Partial<Record<CustomSettingsKeys, unknown>> = SettingsKeyTypes extends Partial<Record<CustomSettingsKeys, unknown>> ? SettingsKeyTypes : never
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
    keys?: CustomSettingsKeyTypes;
    text?: ISettingsGroupPref;
    spacing?: ISettingsGroupPref;
  };
}

// TODO: Helpers to createPreferences and mergePreferences