import { LayoutDirection } from "../layout";
import { SettingsContainerKeys } from "../settings";
import { IPlatformModifier } from "../shortcut";

export interface IReaderState {
  direction: LayoutDirection;
  isImmersive: boolean;
  isHovering: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  settingsContainer: SettingsContainerKeys;
  platformModifier: IPlatformModifier;
}