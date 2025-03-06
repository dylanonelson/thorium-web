import { IRCSSSettings } from "./rcss-settings";
import { ColorScheme } from "./theme";

export interface ICache {
  isImmersive: boolean;
  arrowsOccupySpace: boolean;
  colorScheme?: ColorScheme;
  settings: IRCSSSettings;
}