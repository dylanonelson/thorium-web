import { ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "./layout";
import { ThemeKeys } from "./theme";

export interface IRCSSSettings {
  paginated: boolean;
  colCount: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: ReadingDisplayLineHeightOptions;
  layoutStrategy: RSLayoutStrategy;
  theme: ThemeKeys;
}