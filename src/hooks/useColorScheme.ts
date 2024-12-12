import { useMediaQuery } from "./useMediaQuery";

export enum ColorScheme {
  light = "light",
  dark = "dark"
}

export const useColorScheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return prefersDarkMode ? ColorScheme.dark : ColorScheme.light;
}