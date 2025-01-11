import { StaticBreakpoints } from "../staticBreakpoints";
import { ColorScheme, ThemeKeys } from "../theme";

export interface IThemeState {
  colorScheme: ColorScheme;
  theme: ThemeKeys;
  hasReachedDynamicBreakpoint: boolean;
  staticBreakpoint?: StaticBreakpoints;
}