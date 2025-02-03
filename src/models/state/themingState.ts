import { StaticBreakpoints } from "../staticBreakpoints";
import { ColorScheme, ThemeKeys } from "../theme";

export interface IThemeState {
  colorScheme: ColorScheme;
  theme: ThemeKeys;
  prefersReducedMotion: boolean;
  hasReachedDynamicBreakpoint: boolean;
  staticBreakpoint?: StaticBreakpoints;
}