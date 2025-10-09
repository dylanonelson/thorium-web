# Preferences API Reference

This document details the preferences management system that handles user settings, theming, and layout preferences.

## Core Components

### ThPreferencesProvider

Context provider component for preferences management.

**Props:**
```typescript
interface Props<K extends CustomizableKeys = DefaultKeys> {
  adapter?: ThPreferencesAdapter<K>;
  initialPreferences?: ThPreferences<K>;
  children: React.ReactNode;
}
```

**Features:**
- Preferences context management
- Default preferences handling
- Type-safe customization
- Direction setting
- Adapter support

## Hooks

### usePreferences

Hook for accessing the preferences context.

```typescript
function usePreferences<K extends CustomizableKeys = DefaultKeys>(): {
  preferences: ThPreferences<K>;
}
```

**Features:**
- Type-safe read-only access to preferences
- Context validation
- Automatic type inference for custom preferences

### usePreferenceKeys

Hook for accessing ordered preference keys from the current preferences.

```typescript
function usePreferenceKeys(): {
  reflowActionKeys: string[];
  fxlActionKeys: string[];
  reflowThemeKeys: string[];
  fxlThemeKeys: string[];
  reflowSettingsKeys: string[];
  fxlSettingsKeys: string[];
  mainTextSettingsKeys: string[];
  subPanelTextSettingsKeys: string[];
  mainSpacingSettingsKeys: string[];
  subPanelSpacingSettingsKeys: string[];
}
```

**Features:**
- Read-only access to ordered preference keys
- Automatically updates when preferences change
- Provides access to both reflowable and fixed-layout (FXL) keys
- Custom key support
- Helper functions for type assertion

### useTheming

Hook for managing theme-related preferences and side effects.

```typescript
interface useThemingProps<T extends string> {
  theme: string;
  themeKeys: { [key in T]?: ThemeTokens };
  systemKeys?: {
    light: T;
    dark: T;
  };
  breakpointsMap: BreakpointsMap<number | null>;
  initProps?: Record<string, any>;
  onBreakpointChange?: (breakpoint: ThBreakpoints | null) => void;
  onColorSchemeChange?: (colorScheme: ThColorScheme) => void;
  onContrastChange?: (contrast: ThContrast) => void;
  onForcedColorsChange?: (forcedColors: boolean) => void;
  onMonochromeChange?: (isMonochrome: boolean) => void;
  onReducedMotionChange?: (reducedMotion: boolean) => void;
  onReducedTransparencyChange?: (reducedTransparency: boolean) => void; 
}
```

**Features:**
- Theme management
- System theme detection
- CSS variable handling
- Media query support

## Helpers

### buildThemeObject

Utility for creating theme objects.

```typescript
interface buildThemeProps<T extends string> {
  theme: string;
  themeKeys: { [key in T]?: ThemeTokens };
  systemThemes?: {
    light: T;
    dark: T;
  };
  colorScheme?: ThColorScheme;
}
```

**Features:**
- Theme object creation
- System theme handling