import { ComponentType, SVGProps } from "react";
import { ReadingDisplayAlignOptions, ReadingDisplayLineHeightOptions, RSLayoutStrategy } from "./layout";
import { ThemeKeys } from "./theme";
import { PressEvent, TooltipProps } from "react-aria-components";

export enum SettingsContainerKeys {
  initial = "initial",
  text = "text",
  spacing = "spacing"
}

export enum SettingsKeys {
  align = "align",
  columns = "columns",
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  layout = "layout",
  letterSpacing = "letterSpacing",
  lineHeight = "lineHeight",
  normalizeText = "normalizeText",
  paraIndent = "paraIndent",
  paraSpacing = "paraSpacing",
  publisherStyles = "publisherStyles",
  spacing = "spacing",
  text = "text",
  theme = "theme",
  wordSpacing = "wordSpacing",
  zoom = "zoom"
}

export enum TextSettingsKeys {
  align = "align",
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  normalizeText = "normalizeText"
}

export const defaultTextSettingsMain = [TextSettingsKeys.fontFamily];

export const defaultTextSettingsOrder = [
  TextSettingsKeys.fontFamily,
  TextSettingsKeys.fontWeight,
  TextSettingsKeys.normalizeText,
  TextSettingsKeys.align,
  TextSettingsKeys.hyphens
]

export enum SpacingSettingsKeys {
  lineHeight = "lineHeight",
  letterSpacing = "letterSpacing",
  paraIndent = "paraIndent",
  paraSpacing = "paraSpacing",
  publisherStyles = "publisherStyles",
  wordSpacing = "wordSpacing"
}

export const defaultSpacingSettingsMain = [SpacingSettingsKeys.lineHeight];

export const defaultSpacingSettingsOrder = [
  SpacingSettingsKeys.publisherStyles,
  SpacingSettingsKeys.lineHeight,
  SpacingSettingsKeys.paraSpacing,
  SpacingSettingsKeys.paraIndent,
  SpacingSettingsKeys.wordSpacing,
  SpacingSettingsKeys.letterSpacing
]

export enum SettingsRangeVariant {
  slider = "slider",
  numberField = "numberField"
}

export interface ISettingsTextPref {
  main?: TextSettingsKeys[];
  displayOrder?: TextSettingsKeys[] | null;
}

export interface ISettingsSpacingPref {
  main?: SpacingSettingsKeys[];
  displayOrder?: SpacingSettingsKeys[] | null;
  letterSpacing?: ISettingsRangePref;
  lineHeight?: {
    [key in Exclude<ReadingDisplayLineHeightOptions, ReadingDisplayLineHeightOptions.publisher>]: number
  };
  paraIndent?: ISettingsRangePref;
  paraSpacing?: ISettingsRangePref;
  wordSpacing?: ISettingsRangePref;
}

export interface ISettingsRangePref {
  variant?: SettingsRangeVariant;
  range?: [number, number];
  step?: number;
}

export const defaultParaSpacing: Required<ISettingsRangePref> = {
  variant: SettingsRangeVariant.slider,
  range: [0, 3],
  step: 0.5
}

export const defaultParaIndent: Required<ISettingsRangePref> = {
  variant: SettingsRangeVariant.slider,
  range: [0, 2],
  step: 0.25
}

export const defaultWordSpacing: Required<ISettingsRangePref> = {
  variant: SettingsRangeVariant.numberField,
  range: [0, 1],
  step: 0.1
}

export const defaultLetterSpacing: Required<ISettingsRangePref> = {
  variant: SettingsRangeVariant.numberField,
  range: [0, 0.5],
  step: 0.05
}

export const defaultLineHeights = {
  [ReadingDisplayLineHeightOptions.small]: 1.25,
  [ReadingDisplayLineHeightOptions.medium]: 1.5,
  [ReadingDisplayLineHeightOptions.large]: 1.75
}

export interface ISettingsMapObject {
  Comp: React.FC<IAdvancedDisplayProps> | React.ComponentType<any>;
  props?: any;
}

export interface IReadingDisplayGroupWrapperProps {
  heading: string;
  moreLabel: string;
  moreTooltip: string;
  onMorePressCallback: (e: PressEvent) => void;
  settingsMap: { [key in SpacingSettingsKeys]: ISettingsMapObject } | { [key in TextSettingsKeys]: ISettingsMapObject };
  prefs?: ISettingsTextPref | ISettingsSpacingPref;
  defaultPrefs: {
    main: TextSettingsKeys[] | SpacingSettingsKeys[];
    displayOrder: TextSettingsKeys[] | SpacingSettingsKeys[];
  };
}

export interface IAdvancedIconProps {
  className?: string;
  ariaLabel: string;
  placement: TooltipProps["placement"];
  tooltipLabel: string;
  onPressCallback: (e: PressEvent) => void;
  isDisabled?: boolean;
}

export interface IAdvancedDisplayProps {
  standalone?: boolean;
}

export interface ISettingsSteppersProps {
  decrementIcon?: ComponentType<SVGProps<SVGElement>> | null;
  decrementLabel: string;
  incrementIcon?: ComponentType<SVGProps<SVGElement>> | null;
  incrementLabel: string;
}

interface ISettingsRangeProps {
  standalone?: boolean;
  className?: string;
  label: string;
  defaultValue?: number;
  value: number;
  onChangeCallback: (value: number) => void;
  range: [number, number];
  step: number;
  format?: Intl.NumberFormatOptions;
}

export interface ISettingsNumberFieldProps extends ISettingsRangeProps {
  steppers: ISettingsSteppersProps;
  virtualKeyboardDisabled?: boolean;
  readOnly?: boolean;
}

export interface ISettingsSliderProps extends ISettingsRangeProps {}

export interface ISettingsSwitchProps {
  name?: string;
  className?: string;
  heading?: string;
  label: string;
  isSelected: boolean;
  onChangeCallback: (isSelected: boolean) => void;
}

export interface IRCSSSettings {
  paginated: boolean;
  colCount: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string | null;
  lineHeight: ReadingDisplayLineHeightOptions | null;
  align: ReadingDisplayAlignOptions | null;
  hyphens: boolean | null;
  paraIndent: number | null;
  paraSpacing: number | null;
  lineLength: number | null;
  letterSpacing: number | null;
  wordSpacing: number | null;
  layoutStrategy: RSLayoutStrategy;
  theme: ThemeKeys;
  normalizeText: boolean;
}