import { LayoutDirection, ReadingDisplayFontFamilyOptions } from "../layout";
import { RSLayoutStrategy } from "../layout";
import { IPlatformModifier } from "../shortcut";

export interface IReaderState {
  direction: LayoutDirection;
  isImmersive: boolean;
  isHovering: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  isPaged: boolean;
  colCount: string;
  layoutStrategy: RSLayoutStrategy;
  fontFamily: keyof typeof ReadingDisplayFontFamilyOptions;
  platformModifier: IPlatformModifier;
}