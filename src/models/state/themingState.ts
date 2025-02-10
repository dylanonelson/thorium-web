import { StaticBreakpoints } from "../staticBreakpoints";
import { ColorScheme, ThemeKeys } from "../theme";

export interface IThemeState {
  monochrome: boolean;
  colorScheme: ColorScheme;
  theme: ThemeKeys;
  prefersReducedMotion: boolean;
  prefersReducedTransparency: boolean;
  prefersContrast: boolean;
  forcedColors: boolean;
  hasReachedDynamicBreakpoint: boolean;
  staticBreakpoint?: StaticBreakpoints;
}