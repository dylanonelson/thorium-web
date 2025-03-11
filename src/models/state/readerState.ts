import { LayoutDirection } from "../layout";
import { PaginationStrategy } from "../preferences";
import { IPlatformModifier } from "../shortcut";

export interface IReaderState {
  direction: LayoutDirection;
  isImmersive: boolean;
  isHovering: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  isPaged: boolean;
  colCount: string;
  paginationStrategy: PaginationStrategy;
  platformModifier: IPlatformModifier;
}