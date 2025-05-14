import { LayoutDirection } from "@/preferences/preferences";
import { SettingsContainerKeys } from "../settings";
import { IPlatformModifier } from "@/packages/Helpers/keyboardUtilities";

export interface IReaderState {
  direction: LayoutDirection;
  isLoading: boolean;
  isImmersive: boolean;
  isHovering: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  settingsContainer: SettingsContainerKeys;
  platformModifier: IPlatformModifier;
}