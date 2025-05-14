import fontStacks from "@readium/css/css/vars/fontStacks.json";

import { ISettingsRangePref } from "@/models/settings";
import { LineHeightOptions, SettingsRangeVariant, SpacingSettingsKeys, TextSettingsKeys } from "./enums";

export const defaultTextSettingsMain = [TextSettingsKeys.fontFamily];

export const defaultTextSettingsSubpanel = [
  TextSettingsKeys.fontFamily,
  TextSettingsKeys.fontWeight,
  TextSettingsKeys.align,
  TextSettingsKeys.hyphens,
  TextSettingsKeys.normalizeText
]

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

export const defaultFontFamilyOptions = {
  publisher: null,
  oldStyle: fontStacks.RS__oldStyleTf,
  modern: fontStacks.RS__modernTf,
  sans: fontStacks.RS__sansTf,
  humanist: fontStacks.RS__humanistTf,
  monospace: fontStacks.RS__monospaceTf
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
  [LineHeightOptions.small]: 1.25,
  [LineHeightOptions.medium]: 1.5,
  [LineHeightOptions.large]: 1.75
}