import { IRCSSSettings } from "./settings";
import { ColorScheme } from "@/packages/Hooks/useColorScheme";
import { TocItem } from "@/packages/Helpers/createTocTree";

export interface ICache {
  isImmersive: boolean;
  arrowsOccupySpace: boolean;
  settings: IRCSSSettings;
  tocTree?: TocItem[];
  colorScheme?: ColorScheme;
  reducedMotion?: boolean;
}