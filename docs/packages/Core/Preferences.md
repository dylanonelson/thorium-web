# Core Preferences

The Core package ships with a preferences management system containing a provider, helpers, hooks, and models (defaults and enums).

## Provider

The Core package exposes a context provider to wrap your application and provide the preferences to all components:

```tsx
import { ThStoreProvider } from "@edrlab/thorium-web/core/lib";
import { ThPreferencesProvider } from "@edrlab/thorium-web/core/preferences";

const App = () => {
  return (
    <ThStoreProvider>
      <ThPreferencesProvider>
        {/* Your application */}
      </ThPreferencesProvider>
    </ThStoreProvider>
  );
};
```

It accepts prop `value` of type `ThPreferences` to provide custom preferences. See [Handling Preferences](../../customization/HandlingPreferences.md) for more information.

> [!IMPORTANT]
> When using stateful components from `@edrlab/thorium-web/epub`, you must use the `<ThPreferencesProvider>` from that package, not from `@edrlab/thorium-web/core`. Otherwise, your app and components will use different preferences.

## Helpers

```tsx
import { 
  createPreferences, 
  defaultPreferences,
  ThPreferences 
} from "@edrlab/thorium-web/core/preferences";

// To override default preferences, you can spread the default preferences
// and override the ones you want to change.
const myPreferences: ThPreferences = createPreferences({
  ...defaultPreferences,

  actions: {
    ...defaultPreferences.actions,
    
    reflowOrder: ["settings", "toc", "search", "custom-action"],
    keys: {
      ...defaultPreferences.actions.keys,

      "custom-action": {
        visibility: "collapse",
        shortcut: null
      }
    }
  }
});
```

This will create a new preferences object with the default preferences and the ones you want to change. You can then pass this object to the provider so that components can consume them:

```tsx
import { ThPreferencesProvider } from "@edrlab/thorium-web/core/preferences";
const App = () => {
  return (
      <ThPreferencesProvider initialPreferences={ myPreferences }>
        {/* Your application */}
      </ThPreferencesProvider>
  )
}
```

TBD. buildThemeObject

## Hooks

The Core package exposes several hooks specific to preferences management:

- `usePreferenceKeys`: returns the keys of the preferences’ object e.g. `actions.reflowOrder`;
- `usePreferences`: returns the preferences object and an update method;
- `useTheming`: sets up responsive breakpoints based on preferences, and accessibility hooks – this can then be stored in the `themeReducer` of `lib`.

For instance, if your component needs to access the preferences, you can use the `usePreferences` hook:

```tsx
import { usePreferences } from "@edrlab/thorium-web/core/preferences";
import { ThLayoutDirection } from "@edrlab/thorium-web/core/preferences/models/enums";

const MyPreferencesComponent = () => {
  const { preferences, update } = usePreferences();

  return (
    <div>
      <button onClick={() => update((prev) => ({ ...prev, direction: ThLayoutDirection.rtl }))}>Toggle Direction</button>
      <p>Preferences: { JSON.stringify(preferences) }</p>
    </div>
  );
};
```

If you need keys of the preferences’ object, you can use the `usePreferenceKeys` hook:

```tsx
import { usePreferenceKeys } from "@edrlab/thorium-web/core/preferences";
const MyPreferencesComponent = () => {
  const { reflowThemeKeys } = usePreferenceKeys();
  return (
    <div>
      <p>Themes available for reflow EPUB are: { JSON.stringify(keys) }</p>
    </div>
  );
};
```

The `useTheming` hook is typically used once, to set up responsive breakpoints based on preferences, and accessibility hooks (reduced motion, reduced transparency, monochrome, color scheme, contrast, and forced colors).

TBD.

> [!IMPORTANT]
> When using stateful components from `@edrlab/thorium-web/epub`, you must use the hooks from that package, not from `@edrlab/thorium-web/core`. Otherwise, your app and components will use different preferences.

## Models

The Core package exposes default `const`ants and `enum`s in case you want to use them in your own implementation of an app.

For instance, if you want to import the default `enum` for Actions’ keys, you can do so:

```tsx
import { ThActionsKeys } from "@edrlab/thorium-web/core/preferences";

const myEnum = {
  settings = ThActionsKeys.settings,
  myAction = "my-action-key"
}
```

Default `const`ants provides default preferences for multiple components, such as settings e.g. line-heights, font-size, word-spacing, etc. They also list settings components for text and spacing subpanels, see [Settings document in Customization](../../customization/HandlingPreferences.md#advanced-components) for more details.