import { LayoutDirection } from "../layout";
import { RSPaginationStrategy } from "../preferences";
import { IPlatformModifier } from "../shortcut";

export interface IReaderState {
  direction: LayoutDirection;
  isImmersive: boolean;
  isHovering: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  isPaged: boolean;
  colCount: string;
  paginationStrategy: RSPaginationStrategy;
  platformModifier: IPlatformModifier;
}