"use client";

import { CustomizableKeys, MergedKeys } from "@/preferences/preferences";
import { usePreferences } from "../ThPreferencesContext";

/**
 * Hook to safely access and use preference keys with proper type inference
 * This allows components to use the keys as indexes without type errors
 */
export function usePreferenceKeys<T extends Partial<CustomizableKeys>>() {
  const preferences = usePreferences();
  
  // Return an object with typed keys for each customizable section
  return {
    reflowActionKeys: preferences.actions.reflowOrder as Array<MergedKeys<T>["actionKeys"]>,
    fxlActionKeys: preferences.actions.fxlOrder as Array<MergedKeys<T>["actionKeys"]>,
    reflowThemeKeys: preferences.theming.themes.reflowOrder as Array<MergedKeys<T>["themeKeys"]>,
    fxlThemeKeys: preferences.theming.themes.fxlOrder as Array<MergedKeys<T>["themeKeys"]>,
    reflowSettingsKeys: preferences.settings.reflowOrder as Array<MergedKeys<T>["settingsKeys"]>,
    fxlSettingsKeys: preferences.settings.fxlOrder as Array<MergedKeys<T>["settingsKeys"]>,
    mainTextSettingsKeys: preferences.settings.text?.main as Array<MergedKeys<T>["textSettingsKeys"]> || [],
    subPanelTextSettingsKeys: preferences.settings.text?.subPanel as Array<MergedKeys<T>["textSettingsKeys"]> || [],
    mainSpacingSettingsKeys: preferences.settings.spacing?.main as Array<MergedKeys<T>["spacingSettingsKeys"]> || [],
    subPanelSpacingSettingsKeys: preferences.settings.spacing?.subPanel as Array<MergedKeys<T>["spacingSettingsKeys"]> || [],
    
    // Helper functions that use type assertion with unknown as intermediate step
    asReflowActionKey: <K extends string>(key: K): MergedKeys<T>["actionKeys"] => key as unknown as MergedKeys<T>["actionKeys"],
    asFxlActionKey: <K extends string>(key: K): MergedKeys<T>["actionKeys"] => key as unknown as MergedKeys<T>["actionKeys"],
    asReflowThemeKey: <K extends string>(key: K): MergedKeys<T>["themeKeys"] => key as unknown as MergedKeys<T>["themeKeys"],
    asFxlThemeKey: <K extends string>(key: K): MergedKeys<T>["themeKeys"] => key as unknown as MergedKeys<T>["themeKeys"],
    asReflowSettingsKey: <K extends string>(key: K): MergedKeys<T>["settingsKeys"] => key as unknown as MergedKeys<T>["settingsKeys"],
    asFxlSettingsKey: <K extends string>(key: K): MergedKeys<T>["settingsKeys"] => key as unknown as MergedKeys<T>["settingsKeys"],
    asMainTextSettingsKey: <K extends string>(key: K): MergedKeys<T>["textSettingsKeys"] => key as unknown as MergedKeys<T>["textSettingsKeys"],
    asSubPanelTextSettingsKey: <K extends string>(key: K): MergedKeys<T>["textSettingsKeys"] => key as unknown as MergedKeys<T>["textSettingsKeys"],
    asMainSpacingSettingsKey: <K extends string>(key: K): MergedKeys<T>["spacingSettingsKeys"] => key as unknown as MergedKeys<T>["spacingSettingsKeys"],
    asSubPanelSpacingSettingsKey: <K extends string>(key: K): MergedKeys<T>["spacingSettingsKeys"] => key as unknown as MergedKeys<T>["spacingSettingsKeys"],
  };
}