import { ShortcutRepresentation } from "@/packages/Helpers/keyboardUtilities";
import { BreakpointsMap } from "@/packages/Hooks/useBreakpoints";
import { ThemeTokens } from "@/preferences/hooks/useTheming";
import { ScrollAffordancePref } from "@/packages/Hooks/Epub/scrollAffordance";
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
  dockable: ThDockingTypes,
  dragIndicator?: boolean,
  width?: number,
  minWidth?: number,
  maxWidth?: number
}

export interface ThActionsTokens {
  visibility: CollapsibilityVisibility;
  shortcut: string | null;
  sheet?: {
    defaultSheet: Exclude<ThSheetTypes, ThSheetTypes.dockedStart | ThSheetTypes.dockedEnd>;
    breakpoints: BreakpointsMap<ThSheetTypes>;
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

// TODO: Improve generics when time allows… 
// This is tricky to do in a rush since there are so many
// things you can customize across the app
// Base type for customizable keys
export interface CustomizableKeys {
  actionKeys?: string | number | symbol;
  dockingKeys?: string | number | symbol;
  themeKeys?: string | number | symbol;
  settingsKeys?: string | number | symbol;
  textSettingsKeys?: string | number | symbol;
  spacingSettingsKeys?: string | number | symbol;
  constraintsKeys?: string | number | symbol;
  customSettingsKeyTypes?: Record<string, unknown>;
}

// Default type with all the standard keys
export type DefaultKeys = {
  actionKeys: ThActionsKeys;
  dockingKeys: ThDockingKeys;
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
    ? NonNullable<T[K]> 
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
    topAffordance: ScrollAffordancePref;
    bottomAffordance: ScrollAffordancePref;
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
      reflowOrder: MergedKeys<T>["themeKeys"][];
      fxlOrder: MergedKeys<T>["themeKeys"][];
      keys: {
        [key in Exclude<MergedKeys<T>["themeKeys"], "auto">]: ThemeTokens;
      }
    };
  };
  shortcuts: {
    representation: ShortcutRepresentation;
    joiner?: string;
  };
  actions: ThActionsPref<MergedKeys<T>["actionKeys"]>;
  docking: ThDockingPref<MergedKeys<T>["dockingKeys"]>;
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

/**
 * Deeply merges two preference objects, with values from the second object taking precedence
 * @param basePrefs The base preferences object
 * @param overridePrefs The preferences object with values that should override the base
 * @returns A new preferences object with merged values
 */
export const mergePreferences = <T extends Partial<CustomizableKeys>>(
  basePrefs: ThPreferences<T>,
  overridePrefs: Partial<ThPreferences<T>>
): ThPreferences<T> => {
  // Helper function for deep merging
  const deepMerge = (target: any, source: any): any => {
    if (source === null || source === undefined) {
      return target;
    }
    
    if (target === null || target === undefined) {
      return source;
    }

    // Arrays are replaced, not merged
    if (Array.isArray(source)) {
      return source;
    }

    // Primitive values are replaced
    if (typeof source !== "object" || typeof target !== "object") {
      return source;
    }

    const result = { ...target };
    
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (key in target && typeof target[key] === "object" && typeof source[key] === "object") {
          result[key] = deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  };

  return deepMerge(basePrefs, overridePrefs);
};