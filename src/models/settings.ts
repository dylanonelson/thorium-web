import { ReadingDisplayLineHeightOptions } from "./layout";
import { PressEvent } from "react-aria-components";
import { SheetHeaderVariant } from "./sheets";

export enum SettingsContainerKeys {
  initial = "initial",
  text = "text",
  spacing = "spacing"
}

export enum TextSettingsKeys {
  align = "align",
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  normalizeText = "normalizeText"
}

export const defaultTextSettingsMain = [TextSettingsKeys.fontFamily];

export const defaultTextSettingsSubpanel = [
  TextSettingsKeys.fontFamily,
  TextSettingsKeys.fontWeight,
  TextSettingsKeys.align,
  TextSettingsKeys.hyphens,
  TextSettingsKeys.normalizeText
]

export enum SpacingSettingsKeys {
  letterSpacing = "letterSpacing",
  lineHeight = "lineHeight",
  paraIndent = "paraIndent",
  paraSpacing = "paraSpacing",
  publisherStyles = "publisherStyles",
  wordSpacing = "wordSpacing"
}

export const defaultSpacingSettingsMain = [
  SpacingSettingsKeys.lineHeight
];

export const defaultSpacingSettingsSubpanel = [
  SpacingSettingsKeys.publisherStyles,
  SpacingSettingsKeys.lineHeight,
  SpacingSettingsKeys.wordSpacing,
  SpacingSettingsKeys.letterSpacing,
  SpacingSettingsKeys.paraSpacing,
  SpacingSettingsKeys.paraIndent
]

export enum SettingsRangeVariant {
  slider = "slider",
  numberField = "numberField"
}

export interface ISettingsGroupPref {
  main?: TextSettingsKeys[];
  subPanel?: TextSettingsKeys[] | null;
  header?: SheetHeaderVariant;
}

export interface ISettingsRangePref {
  variant?: SettingsRangeVariant;
  range?: [number, number];
  step?: number;
}

export const defaultFontSize: Required<ISettingsRangePref> = {
  variant: SettingsRangeVariant.numberField,
  range: [0.7, 2.5],
  step: 0.05
}

export const defaultParagraphSpacing: Required<ISettingsRangePref> = {
  variant: SettingsRangeVariant.slider,
  range: [0, 3],
  step: 0.5
}

export const defaultParagraphIndent: Required<ISettingsRangePref> = {
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
  prefs?: ISettingsGroupPref;
  defaultPrefs: {
    main: TextSettingsKeys[] | SpacingSettingsKeys[];
    subPanel: TextSettingsKeys[] | SpacingSettingsKeys[];
  };
}

export interface IAdvancedDisplayProps {
  standalone?: boolean;
}