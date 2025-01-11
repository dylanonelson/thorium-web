import { LayoutDirection } from "../layout";
import { Docked } from "../docking";
import { IPlatformModifier } from "../shortcut";

export interface IReaderState {
  direction: LayoutDirection;
  isImmersive: boolean;
  isHovering: boolean;
  isFullscreen: boolean;
  isPaged: boolean;
  colCount: string;
  overflowMenuOpen: boolean;
  platformModifier: IPlatformModifier;
  leftDock: Docked | null;
  rightDock: Docked | null;
}