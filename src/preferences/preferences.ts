import { ShortcutRepresentation } from "@/packages/Helpers/keyboardUtilities";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { ThemeTokens } from "@/preferences/hooks/useTheming";
import { ScrollAffordancePref } from "@/packages/Hooks/Epub/scrollAffordance";
import { IActionPref } from "@/models/actions";
import { IDockingPref } from "@/models/docking";
import { 
  LineHeightOptions, 
  ScrollBackTo, 
  SettingsKeys, 
  SettingsRangeVariant, 
  SheetHeaderVariant, 
  SheetTypes, 
  SpacingSettingsKeys, 
  TextSettingsKeys, 
  ThemeKeys, 
  ThLayoutDirection, 
  ThLayoutStrategy 
} from "./models/enums";

export interface SettingsGroupPref<T extends keyof typeof SettingsKeys> {
  main?: T[];
  subPanel?: T[] | null;
  header?: SheetHeaderVariant;
}

export interface SettingsRangePref {
  variant?: SettingsRangeVariant;
  range?: [number, number];
  step?: number;
}

export type SettingsKeyTypes = {
  [SettingsKeys.letterSpacing]?: SettingsRangePref;
  [SettingsKeys.lineHeight]?: {
      [key in Exclude<LineHeightOptions, LineHeightOptions.publisher>]: number
    };
  [SettingsKeys.paraIndent]?: SettingsRangePref;
  [SettingsKeys.paraSpacing]?: SettingsRangePref;
  [SettingsKeys.wordSpacing]?: SettingsRangePref;
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
      defaults: {
        dockingWidth: number;
        scrim: string;
      };
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
    // TODO: CUSTOMIZABLE
    text?: SettingsGroupPref<TextSettingsKeys>;
    spacing?: SettingsGroupPref<SpacingSettingsKeys>;
  };
}

// TODO: Helpers to createPreferences and mergePreferences