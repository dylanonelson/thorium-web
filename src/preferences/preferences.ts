import { ShortcutRepresentation } from "@/packages/Helpers/keyboardUtilities";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { ThemeTokens } from "@/preferences/hooks/useTheming";
import { ScrollAffordancePref } from "@/packages/Hooks/Epub/scrollAffordance";
import { 
  ActionKeys,
  DockingKeys,
  DockingTypes,
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
import { Collapsibility, CollapsibilityVisibility } from "@/packages/Components/Actions/hooks/useCollapsibility";

export type ThBottomSheetDetent = "content-height" | "full-height";

export interface ThActionsSnappedPref {
  scrim?: boolean | string;
  maxWidth?: number | null;
  maxHeight?: number | ThBottomSheetDetent;
  peekHeight?: number | ThBottomSheetDetent;
  minHeight?: number | ThBottomSheetDetent;
}

export interface ThActionsDockedPref {
  dockable: DockingTypes,
  dragIndicator?: boolean,
  width?: number,
  minWidth?: number,
  maxWidth?: number
}

export interface ThActionsTokens {
  visibility: CollapsibilityVisibility;
  shortcut: string | null;
  sheet?: {
    defaultSheet: Exclude<SheetTypes, SheetTypes.dockedStart | SheetTypes.dockedEnd>;
    breakpoints: BreakpointsMap<SheetTypes>;
  };
  docked?: ThActionsDockedPref;
  snapped?: ThActionsSnappedPref;
};

export interface ThActionsPref<T extends string | number | symbol> {
  displayOrder: T[];
  collapse: Collapsibility;
  keys: {
    [key in T]: ThActionsTokens;
  }
};

export interface ThDockingPref<T extends string | number | symbol> {
  displayOrder: T[];
  collapse: Collapsibility;
  dock: BreakpointsMap<DockingTypes> | boolean; 
  keys: {
    [key in T]: Pick<ThActionsTokens, "visibility" | "shortcut">;
  }
};

export interface ThSettingsGroupPref<T extends keyof typeof SettingsKeys> {
  main?: T[];
  subPanel?: T[] | null;
  header?: SheetHeaderVariant;
}

export interface ThSettingsRangePref {
  variant?: SettingsRangeVariant;
  range?: [number, number];
  step?: number;
}

export type ThSettingsKeyTypes = {
  [SettingsKeys.letterSpacing]?: ThSettingsRangePref;
  [SettingsKeys.lineHeight]?: {
      [key in Exclude<LineHeightOptions, LineHeightOptions.publisher>]: number
    };
  [SettingsKeys.paraIndent]?: ThSettingsRangePref;
  [SettingsKeys.paraSpacing]?: ThSettingsRangePref;
  [SettingsKeys.wordSpacing]?: ThSettingsRangePref;
  [SettingsKeys.zoom]?: {
    variant?: SettingsRangeVariant;
  };
}

export type ThConstraintKeys = Extract<SheetTypes, SheetTypes.bottomSheet | SheetTypes.popover>;

export interface ThPreferences<
  CustomActionKeys extends string | number | symbol = ActionKeys,
  CustomDockingKeys extends string | number | symbol = DockingKeys,
  CustomThemeKeys extends string | number | symbol = ThemeKeys,
  CustomSettingsKeys extends string | number | symbol = SettingsKeys,
  CustomSettingsKeyTypes extends Partial<Record<CustomSettingsKeys, unknown>> = ThSettingsKeyTypes extends Partial<Record<CustomSettingsKeys, unknown>> ? ThSettingsKeyTypes : never,
  CustomConstraintsKeys extends string | number | symbol = ThConstraintKeys
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
  actions: ThActionsPref<CustomActionKeys>;
  docking: ThDockingPref<CustomDockingKeys>;
  settings: {
    reflowOrder: CustomSettingsKeys[];
    fxlOrder: CustomSettingsKeys[];
    keys?: CustomSettingsKeyTypes;
    // TODO: CUSTOMIZABLE
    text?: ThSettingsGroupPref<TextSettingsKeys>;
    spacing?: ThSettingsGroupPref<SpacingSettingsKeys>;
  };
}

// TODO: Helpers to createPreferences and mergePreferences