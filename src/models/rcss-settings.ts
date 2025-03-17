import { RSLayoutStrategy } from "./layout";
import { ThemeKeys } from "./theme";

export interface IRCSSSettings {
  paginated: boolean;
  colCount: string;
  layoutStrategy: RSLayoutStrategy;
  theme: ThemeKeys;
}