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
export interface ThPreferences<
  CustomActionKeys extends string | number | symbol = ThActionsKeys,
  CustomDockingKeys extends string | number | symbol = ThDockingKeys,
  CustomThemeKeys extends string | number | symbol = ThThemeKeys,
  CustomSettingsKeys extends string | number | symbol = ThSettingsKeys,
  CustomSettingsKeyTypes extends Partial<Record<CustomSettingsKeys, unknown>> = ThSettingsKeyTypes extends Partial<Record<CustomSettingsKeys, unknown>> ? ThSettingsKeyTypes : never,
  CustomTextSettingsKeys extends string | number | symbol = ThTextSettingsKeys,
  CustomSpacingSettingsKeys extends string | number | symbol = ThSpacingSettingsKeys,
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
    text?: ThSettingsGroupPref<CustomTextSettingsKeys>;
    spacing?: ThSettingsGroupPref<CustomSpacingSettingsKeys>;
  };
}

export const createPreferences = <
  CustomActionKeys extends string | number | symbol,
  CustomDockingKeys extends string | number | symbol,
  CustomThemeKeys extends string | number | symbol,
  CustomSettingsKeys extends string | number | symbol,
  CustomSettingsKeyTypes extends Partial<Record<CustomSettingsKeys, unknown>>,
  CustomTextSettingsKeys extends string | number | symbol,
  CustomSpacingSettingsKeys extends string | number | symbol,
  CustomConstraintsKeys extends string | number | symbol
>(
  params: {
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
      text?: ThSettingsGroupPref<CustomTextSettingsKeys>;
      spacing?: ThSettingsGroupPref<CustomSpacingSettingsKeys>;
    };
  }
): ThPreferences<
  CustomActionKeys,
  CustomDockingKeys,
  CustomThemeKeys,
  CustomSettingsKeys,
  CustomSettingsKeyTypes,
  CustomTextSettingsKeys,
  CustomSpacingSettingsKeys,
  CustomConstraintsKeys
> => {
  return {
    ...params,
  }
}

// TODO: Helpers for mergePreferences