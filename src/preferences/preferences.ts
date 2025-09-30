import { UnstableShortcutRepresentation } from "@/core/Helpers/keyboardUtilities";
import { BreakpointsMap } from "@/core/Hooks/useBreakpoints";
import { ThemeTokens } from "@/preferences/hooks/useTheming";
import { 
  ThActionsKeys,
  ThDockingKeys,
  ThDockingTypes,
  ThLineHeightOptions, 
  ThSettingsKeys, 
  ThSettingsRangeVariant, 
  ThSheetHeaderVariant, 
  ThSheetTypes, 
  ThSpacingSettingsKeys, 
  ThTextSettingsKeys, 
  ThThemeKeys, 
  ThLayoutDirection, 
  ThLayoutUI,
  ThBackLinkVariant,
  ThProgressionFormat,
  ThRunningHeadFormat,
  ThBreakpoints,
  ThDocumentTitleFormat,
  ThSpacingPresetKeys,
  ThSettingsRangePlaceholder
} from "./models/enums";
import { ThCollapsibility, ThCollapsibilityVisibility } from "@/core/Components/Actions/hooks/useCollapsibility";

export type ThBackLinkContent = 
  | { 
      type: "img";
      src: string;
      alt?: string;
    }
  | {
      type: "svg";
      content: string; // Raw SVG string
    };

export interface ThBackLinkPref {
  href: string;
  variant?: ThBackLinkVariant;
  visibility?: "always" | "partially";
  content?: ThBackLinkContent;
}

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

export interface ThSettingsSpacingPresets<K extends CustomizableKeys = DefaultKeys> {
  reflowOrder: Array<ThSpacingPresetKeys>;
  // Not customizable as the component is static radiogroup (icons), unlike themes
  // Publisher and custom are not included as they are special cases
  keys: {
    [key in Exclude<ThSpacingPresetKeys, "publisher" | "custom">]?: ThSpacingPreset<K>;
  };
}

export type ThSpacingPreset<K extends CustomizableKeys = DefaultKeys> = {
  [ThSpacingSettingsKeys.letterSpacing]?: number;
  [ThSpacingSettingsKeys.lineHeight]?: ThLineHeightOptions;
  [ThSpacingSettingsKeys.paragraphIndent]?: number;
  [ThSpacingSettingsKeys.paragraphSpacing]?: number;
  [ThSpacingSettingsKeys.wordSpacing]?: number;
} & (K extends { spacing: infer S } 
  ? S extends string 
      ? { [key in S]?: number | ThLineHeightOptions }
    : {}
  : {});

export type CustomizableKeys = {
  action?: string;
  theme?: string;
  settings?: string;
  text?: string;
  spacing?: string;
};

// Key types to better handle custom keys for external consumers
export type ActionKey<K extends CustomizableKeys> = 
  K extends { action: infer A } 
    ? A extends string 
      ? ThActionsKeys | A 
      : ThActionsKeys
    : ThActionsKeys;

export type ThemeKey<K extends CustomizableKeys> = 
  K extends { theme: infer T } 
    ? T extends string 
      ? ThThemeKeys | T 
      : ThThemeKeys
    : ThThemeKeys;

export type SettingsKey<K extends CustomizableKeys> = 
  K extends { settings: infer S } 
    ? S extends string 
      ? ThSettingsKeys | S 
      : ThSettingsKeys
    : ThSettingsKeys;

export type TextSettingsKey<K extends CustomizableKeys> = 
  K extends { text: infer T } 
    ? T extends string 
      ? ThTextSettingsKeys | T 
      : ThTextSettingsKeys
    : ThTextSettingsKeys;

export type SpacingSettingsKey<K extends CustomizableKeys> = 
  K extends { spacing: infer S } 
    ? S extends string 
      ? ThSpacingSettingsKeys | S 
      : ThSpacingSettingsKeys
    : ThSpacingSettingsKeys;

export interface ThActionsPref<K extends CustomizableKeys> {
  reflowOrder: Array<ActionKey<K>>;
  fxlOrder: Array<ActionKey<K>>;
  collapse: ThCollapsibility;
  keys: Record<ActionKey<K>, ThActionsTokens>;
};

export interface ThDockingPref<T extends string> {
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
  placeholder?: ThSettingsRangePlaceholder | string;
  range?: [number, number];
  step?: number;
}

export type ThSettingsKeyTypes<K extends CustomizableKeys = DefaultKeys> = {
  [ThSettingsKeys.letterSpacing]: ThSettingsRangePref;
  [ThSettingsKeys.lineHeight]: {
    [key in Exclude<ThLineHeightOptions, ThLineHeightOptions.publisher>]: number;
  };
  [ThSettingsKeys.paragraphIndent]: ThSettingsRangePref;
  [ThSettingsKeys.paragraphSpacing]: ThSettingsRangePref;
  [ThSettingsKeys.wordSpacing]: ThSettingsRangePref;
  [ThSettingsKeys.zoom]: ThSettingsRangePref;
} & (
  K extends { settings: infer S } 
    ? S extends string 
      ? { [key in S]: any }
      : {}
    : {}
);

export type ThConstraintKeys = Extract<ThSheetTypes, ThSheetTypes.bottomSheet | ThSheetTypes.popover> | "pagination";

export interface ThFormatPrefValue<T extends string | Array<string>> {
  variants: T;
  displayInImmersive?: boolean;
  displayInFullscreen?: boolean;
}

export interface ThFormatPref<T extends string | Array<string>> {
  default: ThFormatPrefValue<T>;
  breakpoints?: { 
    [key in ThBreakpoints]?: ThFormatPrefValue<T>;
  };
}

// Main preferences interface with simplified generics
export interface ThPreferences<K extends CustomizableKeys = {}> {
  direction?: ThLayoutDirection;
  locale?: string;
  metadata?: {
    documentTitle?: {
      // TODO – Templating of custom
      format: ThDocumentTitleFormat | { custom: string };
    };
  };
  typography: {
    minimalLineLength?: number | null;
    maximalLineLength?: number | null;
    optimalLineLength: number;
    pageGutter: number;
  };
  theming: {
    header?: {
      backLink?: ThBackLinkPref | null;
      runningHead?: {
        format?: {
          reflow?: ThFormatPref<ThRunningHeadFormat>;
          fxl?: ThFormatPref<ThRunningHeadFormat>;
        }
      }
    };
    progression?: {
      format?: {
        reflow?: ThFormatPref<ThProgressionFormat | Array<ThProgressionFormat>>;
        fxl?: ThFormatPref<ThProgressionFormat | Array<ThProgressionFormat>>;
      };
    };
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
      ui?: {
        reflow?: ThLayoutUI,
        fxl?: ThLayoutUI
      };
      radius: number;
      spacing: number;
      defaults: {
        dockingWidth: number;
        scrim: string;
      };
      constraints?: {
        [key in ThConstraintKeys]?: number | null
      }
    };
    breakpoints: BreakpointsMap<number | null>;
    themes: {
      reflowOrder: Array<ThemeKey<K> | "auto">;
      fxlOrder: Array<ThemeKey<K> | "auto">;
      systemThemes?: {
        light: ThemeKey<K>;
        dark: ThemeKey<K>;
      };
      // keys never includes "auto"
      keys: Record<Exclude<ThemeKey<K>, "auto"> & string, ThemeTokens>;
    };
  };
  affordances: {
    scroll: {
      hintInImmersive: boolean;
      toggleOnMiddlePointer: Array<"tap" | "click">;
      hideOnForwardScroll: boolean;
      showOnBackwardScroll: boolean;
    }
  };
  actions: ThActionsPref<K>;
  shortcuts: {
    representation: UnstableShortcutRepresentation;
    joiner?: string;
  };
  docking: ThDockingPref<ThDockingKeys>;
  settings: {
    reflowOrder: Array<SettingsKey<K>>;
    fxlOrder: Array<SettingsKey<K>>;
    keys: ThSettingsKeyTypes<K>;
    text?: ThSettingsGroupPref<TextSettingsKey<K>>;
    spacing?: ThSettingsGroupPref<SpacingSettingsKey<K>> & { presets?: ThSettingsSpacingPresets<K> };
  };
}

/**
 * Creates a new preferences object with the provided parameters
 * @param params The preferences object to create
 * @returns A new preferences object
 */
export const createPreferences = <K extends CustomizableKeys = {}>(
  params: ThPreferences<K>
): ThPreferences<K> => {
  // Helper function to validate keys against the provided order arrays
  const validateObjectKeys = <K extends string, V>(
    orderArrays: K[][],
    keysObj: Record<string, V>,
    context: string,
    specialCase?: string | string[],
    fallback?: V
  ): void => {
    // Combine all arrays and filter out special cases if needed
    const allOrders = new Set<K>(
      orderArrays.flatMap(arr => {
        if (!specialCase) return arr;
        return arr.filter(k => {
          if (Array.isArray(specialCase)) {
            return !specialCase.includes(k);
          } else {
            return k !== specialCase;
          }
        });
      })
    );
    
    // Get available keys
    const availableKeys = Object.keys(keysObj);
    
    // Check that all keys exist and add from fallback if available
    allOrders.forEach(key => {
      if (!availableKeys.includes(key)) {
        if (fallback) {
          // Add the missing key from fallback to the params object
          keysObj[key] = fallback;
        }
        console.warn(`Key "${ key }" in ${ context } order arrays not found in ${ context }.keys.${ fallback ? `\nUsing fallback: ${ JSON.stringify(fallback) }` : "" }`);
      }
    });
  };
  
  // Validate actions
  if (params.actions) {
    validateObjectKeys<ActionKey<K>, ThActionsTokens>(
      [params.actions.reflowOrder as Array<ActionKey<K>>, params.actions.fxlOrder as Array<ActionKey<K>>],
      params.actions.keys as Record<string, ThActionsTokens>,
      "actions"
    );
  }
  
  // Validate themes
  if (params.theming?.themes) {
    validateObjectKeys<ThemeKey<K> | "auto", ThemeTokens>(
      [params.theming.themes.reflowOrder as Array<ThemeKey<K> | "auto">, params.theming.themes.fxlOrder as Array<ThemeKey<K> | "auto">],
      params.theming.themes.keys as Record<string, ThemeTokens>,
      "theming.themes",
      "auto" // Special case for themes
    );
  }

  // Validate spacing presets
  if (params.settings.spacing?.presets) {
    validateObjectKeys<ThSpacingPresetKeys, ThSpacingPreset<K>>(
      [params.settings.spacing.presets.reflowOrder],
      params.settings.spacing.presets.keys as Record<string, ThSpacingPreset<K>>,
      "settings.spacing.presets",
      ["publisher", "custom"]
    );
  }

  // Validate spacing values in theming against settings
  if (params.settings?.spacing?.presets?.keys && params.settings?.keys) {
    const spacingSettings = params.settings.spacing.presets.keys;
    const spacingThemes = params.settings.spacing.presets.keys;
    
    // Helper function to adjust a value to the nearest valid step or range boundary
    const adjustSpacingValue = (key: string, value: number, context: string[]): number => {
      // Type-safe way to get the setting
      const settingKey = Object.values(ThSettingsKeys).find((k) => k === key);
      if (!settingKey) {
        return value; // Return as-is if no setting found
      }
      
      const setting = (spacingSettings as any)[settingKey];
      if (!setting) {
        return value; // Return as-is if no setting found
      }
      
      // Handle different setting types
      let range: [number, number] | undefined;
      let step: number | undefined;
      
      if (setting && typeof setting === "object" && "range" in setting) {
        range = setting.range;
        step = setting.step;
      } else if (setting && typeof setting === "object") {
        // Handle nested settings (like lineHeight and margin)
        // These will be validated when their parent key is validated
        return value;
      }
      
      let adjustedValue = value;
      
      // Adjust to range boundaries if needed
      if (range) {
        const [min, max] = range;
        if (adjustedValue < min) {
          console.warn(`Adjusting value ${ value } for ${ context.join(".") } to minimum allowed value ${ min }`);
          adjustedValue = min;
        } else if (adjustedValue > max) {
          console.warn(`Adjusting value ${ value } for ${ context.join(".") } to maximum allowed value ${ max }`);
          adjustedValue = max;
        }
      }
      
      // Adjust to nearest step if needed
      if (step && range) {
        const [min] = range;
        const steps = Math.round((adjustedValue - min) / step);
        const steppedValue = parseFloat((min + (steps * step)).toFixed(10));
        
        // Ensure the stepped value is within range (in case of floating point precision issues)
        const finalValue = Math.min(Math.max(steppedValue, range[0]), range[1]);
        
        if (Math.abs(finalValue - adjustedValue) > Number.EPSILON) {
          console.warn(`Adjusting value ${ value } for ${ context.join(".") } to nearest step value ${ finalValue }`);
          adjustedValue = finalValue;
        }
      }
      
      return adjustedValue;
    };
    
    // Process each spacing theme to adjust values to valid steps/ranges
    for (const [themeName, spacingTheme] of Object.entries(spacingThemes)) {
      if (spacingTheme && typeof spacingTheme === "object") {
        const adjustedTheme: Record<string, any> = {};
        let hasAdjustedValues = false;
        
        // Process each value in the theme
        for (const [key, value] of Object.entries(spacingTheme)) {
          if (typeof value === "number") {
            const context = ["theming", "spacing", "keys", themeName, key];
            const adjustedValue = adjustSpacingValue(key, value, context);
            adjustedTheme[key] = adjustedValue;
            
            if (adjustedValue !== value) {
              hasAdjustedValues = true;
            }
          } else {
            // Keep non-number values as-is
            adjustedTheme[key] = value;
          }
        }
        
        // Replace the theme with adjusted values if any changes were made
        if (hasAdjustedValues) {
          // @ts-ignore - We know spacingThemes[themeName] is mutable
          spacingThemes[themeName as keyof typeof spacingThemes] = adjustedTheme;
        }
      }
    }
  }
  
  return params;
};

// Default internal keys alias for convenience
export type DefaultKeys = {
  action: ThActionsKeys;
  theme: ThThemeKeys;
  settings: ThSettingsKeys;
  text: ThTextSettingsKeys;
  spacing: ThSpacingSettingsKeys;
};

// Type helpers that support both custom and default keys
export type ActionKeyType<K extends CustomizableKeys = DefaultKeys> = K["action"] extends string ? K["action"] : ThActionsKeys;
export type ThemeKeyType<K extends CustomizableKeys = DefaultKeys> = K["theme"] extends string ? K["theme"] : ThThemeKeys;
export type SettingsKeyType<K extends CustomizableKeys = DefaultKeys> = K["settings"] extends string ? K["settings"] : ThSettingsKeys;
export type TextSettingsKeyType<K extends CustomizableKeys = DefaultKeys> = K["text"] extends string ? K["text"] : ThTextSettingsKeys;
export type SpacingSettingsKeyType<K extends CustomizableKeys = DefaultKeys> = K["spacing"] extends string ? K["spacing"] : ThSpacingSettingsKeys;