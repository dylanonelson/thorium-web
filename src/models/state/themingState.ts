import { ColorScheme, ThemeKeys } from "../preferences";
import { StaticBreakpoints } from "../staticBreakpoints";

export interface IThemeState {
  colorScheme: ColorScheme;
  theme: ThemeKeys;
  hasReachedDynamicBreakpoint: boolean;
  staticBreakpoint?: StaticBreakpoints;
}