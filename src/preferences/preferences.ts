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

export type BottomSheetDetent = "content-height" | "full-height";

export interface SnappedPref {
  scrim?: boolean | string;
  maxWidth?: number | null;
  maxHeight?: number | BottomSheetDetent;
  peekHeight?: number | BottomSheetDetent;
  minHeight?: number | BottomSheetDetent;
}

export interface ActionsDockedPref {
  dockable: DockingTypes,
  dragIndicator?: boolean,
  width?: number,
  minWidth?: number,
  maxWidth?: number
}

export interface ActionTokens {
  visibility: CollapsibilityVisibility;
  shortcut: string | null;
  sheet?: {
    defaultSheet: Exclude<SheetTypes, SheetTypes.dockedStart | SheetTypes.dockedEnd>;
    breakpoints: BreakpointsMap<SheetTypes>;
  };
  docked?: ActionsDockedPref;
  snapped?: SnappedPref;
};

export interface ActionsPref {
  displayOrder: ActionKeys[];
  collapse: Collapsibility;
  keys: {
    [key in ActionKeys]: ActionTokens;
  }
};

export interface DockingPref {
  displayOrder: DockingKeys[];
  collapse: Collapsibility;
  dock: BreakpointsMap<DockingTypes> | boolean; 
  keys: {
    [key in  DockingKeys]: ActionTokens;
  }
};

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
  actions: ActionsPref;
  docking: DockingPref;
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