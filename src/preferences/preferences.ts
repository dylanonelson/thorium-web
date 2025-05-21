import { UnstableShortcutRepresentation } from "@/packages/Helpers/keyboardUtilities";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { ThemeTokens } from "@/preferences/hooks/useTheming";
import { ThScrollAffordancePref } from "@/packages/Hooks/Epub/scrollAffordance";
import { 
  ThActionsKeys,
  ThDockingKeys,
  ThDockingTypes,
  ThLineHeightOptions, 
  ThScrollBackTo, 
  ThSettingsKeys, 
  ThSettingsRangeVariant, 
  ThSheetHeaderVariant, 
  ThSheetTypes, 
  ThSpacingSettingsKeys, 
  ThTextSettingsKeys, 
  ThThemeKeys, 
  ThLayoutDirection, 
  ThLayoutStrategy 
} from "./models/enums";
import { ThCollapsibility, ThCollapsibilityVisibility } from "@/packages/Components/Actions/hooks/useCollapsibility";

export type ThBottomSheetDetent = "content-height" | "full-height";

export interface ThActionsSnappedPref {
  scrim?: boolean | string;
  maxWidth?: number | null;
  maxHeight?: number | ThBottomSheetDetent;
  peekHeight?: number | ThBottomSheetDetent;
  minHeight?: number | ThBottomSheetDetent;
}

export interface ThActionsDockedPref {
  dockable: ThDockingTypes,
  dragIndicator?: boolean,
  width?: number,
  minWidth?: number,
  maxWidth?: number
}

export interface ThActionsTokens {
  visibility: ThCollapsibilityVisibility;
  shortcut: string | null;
  sheet?: {
    defaultSheet: Exclude<ThSheetTypes, ThSheetTypes.dockedStart | ThSheetTypes.dockedEnd>;
    breakpoints: BreakpointsMap<ThSheetTypes>;
  };
  docked?: ThActionsDockedPref;
  snapped?: ThActionsSnappedPref;
};

export interface ThActionsPref<T extends string | number | symbol> {
  reflowOrder: T[];
  fxlOrder: T[];
  collapse: ThCollapsibility;
  keys: {
    [key in T]: ThActionsTokens;
  }
};

export interface ThDockingPref<T extends string | number | symbol> {
  displayOrder: T[];
  collapse: ThCollapsibility;
  dock: BreakpointsMap<ThDockingTypes> | boolean; 
  keys: {
    [key in T]: Pick<ThActionsTokens, "visibility" | "shortcut">;
  }
};

export interface ThSettingsGroupPref<T> {
  main?: T[];
  subPanel?: T[] | null;
  header?: ThSheetHeaderVariant;
}

export interface ThSettingsRangePref {
  variant?: ThSettingsRangeVariant;
  range?: [number, number];
  step?: number;
}

export type ThSettingsKeyTypes = {
  [ThSettingsKeys.letterSpacing]?: ThSettingsRangePref;
  [ThSettingsKeys.lineHeight]?: {
      [key in Exclude<ThLineHeightOptions, ThLineHeightOptions.publisher>]: number
    };
  [ThSettingsKeys.paragraphIndent]?: ThSettingsRangePref;
  [ThSettingsKeys.paragraphSpacing]?: ThSettingsRangePref;
  [ThSettingsKeys.wordSpacing]?: ThSettingsRangePref;
  [ThSettingsKeys.zoom]?: ThSettingsRangePref;
}

export type ThConstraintKeys = Extract<ThSheetTypes, ThSheetTypes.bottomSheet | ThSheetTypes.popover>;

export interface CustomizableKeys {
  actionKeys?: string;
  themeKeys?: string;
  settingsKeys?: string;
  textSettingsKeys?: string;
  spacingSettingsKeys?: string;
  constraintsKeys?: string;
  customSettingsKeyTypes?: Record<string, unknown>;
}

// Default type with all the standard keys
export type DefaultKeys = {
  actionKeys: ThActionsKeys;
  themeKeys: ThThemeKeys;
  settingsKeys: ThSettingsKeys;
  textSettingsKeys: ThTextSettingsKeys;
  spacingSettingsKeys: ThSpacingSettingsKeys;
  constraintsKeys: ThConstraintKeys;
  customSettingsKeyTypes: ThSettingsKeyTypes;
}

// Helper type to merge custom keys with defaults
export type MergedKeys<T extends Partial<CustomizableKeys>> = {
  [K in keyof DefaultKeys]: K extends keyof T 
    ? T[K] extends string
      ? T[K] | DefaultKeys[K]
      : DefaultKeys[K]
    : DefaultKeys[K];
}

// Main preferences interface with simplified generics
export interface ThPreferences<T extends Partial<CustomizableKeys> = {}> {
  direction?: ThLayoutDirection;
  locale?: string;
  typography: {
    minimalLineLength?: number | null;
    maximalLineLength?: number | null;
    optimalLineLength: number;
    pageGutter: number;
    layoutStrategy?: ThLayoutStrategy | null;
  };
  scroll: {
    topAffordance: ThScrollAffordancePref;
    bottomAffordance: ThScrollAffordancePref;
    backTo: ThScrollBackTo;
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
        [key in MergedKeys<T>["constraintsKeys"]]?: number
      }
    };
    breakpoints: BreakpointsMap<number | null>;
    themes: {
      reflowOrder: (MergedKeys<T>["themeKeys"] | "auto")[];
      fxlOrder: (MergedKeys<T>["themeKeys"] | "auto")[];
      systemThemes?: {
        light: MergedKeys<T>["themeKeys"];
        dark: MergedKeys<T>["themeKeys"];
      };
      keys: {
        [key in MergedKeys<T>["themeKeys"]]: ThemeTokens;
      };
    };
  };
  shortcuts: {
    representation: UnstableShortcutRepresentation;
    joiner?: string;
  };
  actions: ThActionsPref<MergedKeys<T>["actionKeys"]>;
  docking: ThDockingPref<ThDockingKeys>;
  settings: {
    reflowOrder: MergedKeys<T>["settingsKeys"][];
    fxlOrder: MergedKeys<T>["settingsKeys"][];
    keys?: MergedKeys<T>["customSettingsKeyTypes"];
    text?: ThSettingsGroupPref<MergedKeys<T>["textSettingsKeys"]>;
    spacing?: ThSettingsGroupPref<MergedKeys<T>["spacingSettingsKeys"]>;
  };
}

/**
 * Creates a new preferences object with the provided parameters
 * @param params The preferences object to create
 * @returns A new preferences object
 */
export const createPreferences = <T extends Partial<CustomizableKeys>>(
  params: ThPreferences<T>
): ThPreferences<T> => {
  return {
    ...params,
  };
}

// Type helper to get the key type from preferences
export type PreferenceKeyType<T extends keyof DefaultKeys> = MergedKeys<CustomizableKeys>[T];

// Specific key type helpers
export type ActionKeyType = PreferenceKeyType<"actionKeys">;
export type DockingKeyType = ThDockingKeys;
export type ThemeKeyType = PreferenceKeyType<"themeKeys">;
export type SettingsKeyType = PreferenceKeyType<"settingsKeys">;
export type TextSettingsKeyType = PreferenceKeyType<"textSettingsKeys">;
export type SpacingSettingsKeyType = PreferenceKeyType<"spacingSettingsKeys">;