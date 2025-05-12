import { Breakpoints } from "@/packages/Hooks";
import { ThemeKeys } from "../theme";
import { ColorScheme } from "@/packages/Hooks/useColorScheme";
import { Contrast } from "@/packages/Hooks/useContrast";

export interface IThemeState {
  monochrome: boolean;
  colorScheme: ColorScheme;
  theme: ThemeKeys;
  prefersReducedMotion: boolean;
  prefersReducedTransparency: boolean;
  prefersContrast: Contrast;
  forcedColors: boolean;
  breakpoint?: Breakpoints;
}