import { ReadingDisplayAlignOptions, ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "./layout";
import { ThemeKeys } from "./theme";

export enum SettingsKeys {
  zoom = "zoom",
  fontFamily = "fontFamily",
  lineHeight = "lineHeight",
  layout = "layout",
  theme = "theme",
  columns = "columns"
}

export interface ISettingsSwitchProps {
  name?: string;
  className?: string;
  heading?: string;
  label: string;
  onChangeCallback: (isSelected: boolean) => void;
  isSelected: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface IRCSSSettings {
  paginated: boolean;
  colCount: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: ReadingDisplayLineHeightOptions;
  align: ReadingDisplayAlignOptions | null;
  hyphens: boolean | null;
  layoutStrategy: RSLayoutStrategy;
  theme: ThemeKeys;
}