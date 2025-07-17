# Internationalization (i18n) Setup

This project uses `react-i18next` for internationalization with a simple and flexible setup that works whether you"re forking the repository or using it as a package.

## Default Configuration

The i18n system comes with these sensible defaults:
- Default language: `en`
- Default namespace: `thorium-web`
- Translation files path: `/locales/{{lng}}/{{ns}}.json`
- Language detection: Uses browser"s navigator language
- Fallback language: `en`

## Basic Usage

### 1. Add Translation Files

Add your translation files in `public/locales/{languageCode}/`:

```
public/
  locales/
    en/
      thorium-web.json
    fr/
      thorium-web.json
```

Example translation file (`en/thorium-web.json`):

```json
{
  "welcome": "Welcome to Thorium Web",
  "description": "This is a localized component"
}
```

### 2. Use Translations in Components

```tsx
import { useI18n } from "@/i18n";

function MyComponent() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{ t("welcome") }</h1>
      <p>{ t("description") }</p>
    </div>
  );
}
```

## Using as a Package

When using `@edrlab/thorium-web` as a package, wrap your app with the `I18nProvider`:

```tsx
import { I18nProvider } from "@edrlab/thorium-web";

function App() {
  return (
    <I18nProvider
      lng="en"
      fallbackLng="en"
    >
      <YourApp />
    </I18nProvider>
  );
}
```

## Available Options

The `I18nProvider` accepts all `i18next` initialization options. Here are the most commonly used ones:

- `lng`: Set the default language (defaults to browser language)
- `fallbackLng`: Fallback language (default: `en`)
- `resources`: Preload translations
- `ns`: Namespaces to use (default: `["thorium-web"]`)
- `defaultNS`: Default namespace (default: `thorium-web`)
- `interpolation`: Configure interpolation options
- `detection`: Configure language detection
- `backend`: Configure backend options

## Advanced Usage

### Backend Configuration

The i18n system uses `i18next-http-backend` by default to load translation files. All configuration is passed directly through the `I18nProvider` component.

#### Basic Usage

```tsx
function App() {
  return (
    <I18nProvider
      backend={{
        loadPath: "/locales/{{lng}}/{{ns}}.json"
      }}
    >
      <YourApp />
    </I18nProvider>
  );
}
```

#### Custom Backend Options

You can customize the backend by passing options to the `backend` prop:

```tsx
function App() {
  return (
    <I18nProvider
      backend={{
        // Load from a custom path
        loadPath: "/my-custom-path/{{lng}}/{{ns}}.json",
        // Add custom headers
        customHeaders: {
          "X-Custom-Header": "value"
        },
        // Enable CORS if needed
        crossDomain: true,
        // Add request credentials
        withCredentials: true
      }}
    >
      <YourApp />
    </I18nProvider>
  );
}
```

#### File Structure

By default, the backend expects translation files to be structured like this:

```
public/
  locales/
    en/
      thorium-web.json
    fr/
      thorium-web.json
```

#### Loading from a CDN

To load translations from a CDN or external URL:

```tsx
function App() {
  return (
    <I18nProvider
      backend={{
        loadPath: "https://cdn.example.com/locales/{{lng}}/{{ns}}.json",
        crossDomain: true
      }}
    >
      <YourApp />
    </I18nProvider>
  );
}
```

### Using resources instead of backend

You can also provide translations directly through the `resources` prop:

```tsx
function App() {
  return (
    <I18nProvider
      resources={{
        en: {
          "thorium-web": {
            welcome: "Welcome to Thorium Web",
            description: "This is a localized component",
          },
        },
        fr: {
          "thorium-web": {
            welcome: "Bienvenue sur Thorium Web",
            description: "Ceci est un composant localisé",
          },
        },
      }}
      lng="en"
      fallbackLng="en"
    >
      <YourApp />
    </I18nProvider>
  );
}
```

### Multiple Namespaces

To organize translations into multiple namespaces:

1. **Define namespaced translations**:
   ```
   public/locales/
     en/
       common.json
       auth.json
     fr/
       common.json
       auth.json
   ```

2. **Configure namespaces in your app**:
   ```tsx
   <I18nProvider
     lng="en"
     fallbackLng="en"
     ns={["common", "auth"]}
     defaultNS="common"
   >
     <YourApp />
   </I18nProvider>
   ```

3. **Use namespaced translations**:
   ```tsx
   function AuthForm() {
     const { t } = useI18n();
     
     return (
       <div>
         <h1>{ t("auth:title") }</h1>
         <p>{ t("common:loading") }</p>
       </div>
     );
   }
   ```

### Language Detection

The i18n system includes language detection using `i18next-browser-languagedetector`. Configure it through the `detection` prop in `I18nProvider`:

#### Basic Usage

```tsx
function App() {
  return (
    <I18nProvider
      detection={{
        order: ["querystring", "navigator"],
        lookupQuerystring: "lng",
        caches: []
      }}
    >
      <YourApp />
    </I18nProvider>
  );
}
```

#### Common Configuration Options

```tsx
function App() {
  return (
    <I18nProvider
      detection={{
        // Order of language detection
        order: ["querystring", "cookie", "localStorage", "navigator"],
        
        // Keys to look for in the querystring
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
        
        // Cache the detected language in
        caches: ["localStorage"],
        
        // Optional expire and domain for cookies
        cookieMinutes: 10,
        cookieDomain: "my-domain.com",
        
        // Only detect languages that are in the whitelist
        checkWhitelist: true
      }}
    >
      <YourApp />
    </I18nProvider>
  );
}
```

#### Disabling Language Detection

To disable language detection completely:

```tsx
function App() {
  return (
    <I18nProvider detection={ false }>
      <YourApp />
    </I18nProvider>
  );
}
```

When you want to fetch translations from a custom endpoint:

```tsx
import { I18nProvider } from "@edrlab/thorium-web";

function App() {
  return (
    <I18nProvider 
      config={{
        namespace: "my-app",
        loadPath: "/api/i18n/{{lng}}/{{ns}}",
        initOptions: {
          detection: {
            order: ["cookie", "localStorage", "navigator"],
            caches: ["cookie"]
          }
        }
      }}
      lng="en"
      fallbackLng="en"
    >
      <YourApp />
    </I18nProvider>
  );
}
```

## Available Hooks and Components

### `useI18n` Hook

The `useI18n` hook provides access to translation functions and i18n settings. It accepts an optional namespace parameter:

```typescript
const {
  t,                // Translation function
  i18n,            // i18n instance
  ready,           // Whether translations are loaded
  changeLanguage,  // Function to change the current language (updates preferences)
  currentLanguage, // Current language code
  languages,       // List of available languages
} = useI18n("optional-namespace");

// Example usage:
const { t, changeLanguage, currentLanguage } = useI18n();

// Change language (will update preferences)
const handleLanguageChange = (lang) => {
  changeLanguage(lang);
};
```

### `Trans` Component

The `Trans` component is used for complex translations that include components:

```tsx
import { Trans } from "@/i18n";

function MyComponent() {
  return (
    <Trans i18nKey="welcome">
      Welcome to <strong>Thorium Web</strong>
    </Trans>
  );
}
```

## Best Practices

- Always use the `useI18n` hook or `Trans` component for all user-facing text
- Keep translation keys consistent and descriptive
- Use namespaces to organize translations for different features
- Always provide a default (English) translation
