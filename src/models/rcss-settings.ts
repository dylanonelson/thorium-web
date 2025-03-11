import { PaginationStrategy } from "./preferences";
import { ThemeKeys } from "./theme";

export interface IRCSSSettings {
  paginated: boolean;
  colCount: string;
  paginationStrategy: PaginationStrategy;
  theme: ThemeKeys;
}