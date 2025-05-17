import { ThColorScheme } from "@/packages/Hooks/useColorScheme";
import { ThemeTokens } from "../hooks/useTheming";

// We cannot import from Readium Navigator cos' otherwise next build fails
// with error: Error occurred prerendering page "/_not-found". 
// Read more: https://nextjs.org/docs/messages/prerender-error 
// ReferenceError: window is not defined
enum TsToolkitTheme {
  day = "day",
  night = "night",
  sepia = "sepia",
  custom = "custom"
}

export interface buildThemeProps<T extends string> {
  theme: T | "auto";
  themeKeys: Record<T, ThemeTokens>
  lightTheme?: T;
  darkTheme?: T;
  colorScheme?: ThColorScheme;
}

export const buildThemeObject = <T extends string>({
  theme,
  themeKeys,
  lightTheme,
  darkTheme,
  colorScheme
}: buildThemeProps<T>) => {
    if (theme === "auto" && colorScheme && lightTheme && darkTheme) {
      theme = colorScheme === ThColorScheme.dark ? darkTheme : lightTheme;
    }

    let themeProps = {};

    switch(theme) {
      case "auto":
        break;
      case "light":
      case "day":
        themeProps = {
          theme: TsToolkitTheme.day,
          backgroundColor: null,
          textColor: null,
          linkColor: null,
          selectionBackgroundColor: null,
          selectionTextColor: null,
          visitedColor: null
        };
        break;
      case "dark":
      case "night":
        themeProps = {
          theme: TsToolkitTheme.night,
          backgroundColor: null,
          textColor: null,
          linkColor: null,
          selectionBackgroundColor: null,
          selectionTextColor: null,
          visitedColor: null
        };
        break;
      case "sepia":
        themeProps = {
          theme: TsToolkitTheme.sepia,
          backgroundColor: null,
          textColor: null,
          linkColor: null,
          selectionBackgroundColor: null,
          selectionTextColor: null,
          visitedColor: null
        };
        break;
      default:
        themeProps = {
          theme: TsToolkitTheme.custom,
          backgroundColor: themeKeys[theme].background,
          textColor: themeKeys[theme].text,
          linkColor: themeKeys[theme].link,
          selectionBackgroundColor: themeKeys[theme].select,
          selectionTextColor: themeKeys[theme].onSelect,
          visitedColor: themeKeys[theme].visited
        };
        break;
    }
    return themeProps;
  };