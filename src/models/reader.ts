import { IRCSSSettings } from "./rcss-settings";
import { ColorScheme } from "./theme";

export interface ICache {
  isImmersive: boolean;
  arrowsOccupySpace: boolean;
  settings: IRCSSSettings;
  colorScheme?: ColorScheme;
  reducedMotion?: boolean;
}