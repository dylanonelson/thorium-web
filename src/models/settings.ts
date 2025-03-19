import { ComponentType, SVGProps } from "react";
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

export interface ISettingsSteppersProps {
  decrementIcon: ComponentType<SVGProps<SVGElement>>;
  decrementLabel: string;
  incrementIcon: ComponentType<SVGProps<SVGElement>>;
  incrementLabel: string;
}

export interface ISettingsNumberFieldProps {
  className?: string;
  label: string;
  defaultValue?: number;
  value: number;
  onChangeCallback: (value: number) => void;
  range: [number, number];
  step: number;
  steppers: ISettingsSteppersProps;
  format: Intl.NumberFormatOptions;
  disabled?: boolean;
  wheelDisabled?: boolean;
  virtualKeyboardDisabled?: boolean;
  readOnly?: boolean;
}

export interface ISettingsSwitchProps {
  name?: string;
  className?: string;
  heading?: string;
  label: string;
  onChangeCallback: (isSelected: boolean) => void;
  selected: boolean;
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