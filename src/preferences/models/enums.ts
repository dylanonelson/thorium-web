"use client";

export enum ThLayoutUI {
  stacked = "stacked-ui",
  layered = "layered-ui"
}

export enum ThActionsKeys {
  fullscreen = "fullscreen",
  jumpToPosition = "jumpToPosition",
  settings = "settings",
  toc = "toc"
}

export enum ThBreakpoints {
  compact = "compact",
  medium = "medium",
  expanded = "expanded",
  large = "large",
  xLarge = "xLarge"
}

export enum ThDockingKeys {
  start = "dockingStart",
  end = "dockingEnd",
  transient = "dockingTransient"
}

export enum ThDockingTypes {
  none = "none",
  both = "both",
  start = "start",
  end = "end"
}

export enum ThScrollBackTo {
  top = "top",
  bottom = "bottom",
  untouched = "untouched"
}

export enum ThSettingsKeys {
  columns = "columns",
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  layout = "layout",
  letterSpacing = "letterSpacing",
  lineHeight = "lineHeight",
  paragraphIndent = "paragraphIndent",
  paragraphSpacing = "paragraphSpacing",
  publisherStyles = "publisherStyles",
  spacingGroup = "spacingGroup",
  textAlign = "textAlign",
  textGroup = "textGroup",
  textNormalize = "textNormalize",
  theme = "theme",
  wordSpacing = "wordSpacing",
  zoom = "zoom"
}

export enum ThTextSettingsKeys {
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  textAlign = "textAlign",
  textNormalize = "textNormalize"
}

export enum ThScrollAffordancePref {
  none = "none",
  prev = "previous",
  next = "next",
  both = "both"
}

export interface ScrollAffordanceConfig {
  pref: ThScrollAffordancePref;
  placement: "top" | "bottom";
  className?: string;
  styleSheetContent?: string;
}

export enum ThSpacingSettingsKeys {
  letterSpacing = "letterSpacing",
  lineHeight = "lineHeight",
  paragraphIndent = "paragraphIndent",
  paragraphSpacing = "paragraphSpacing",
  publisherStyles = "publisherStyles",
  wordSpacing = "wordSpacing"
}

export enum ThSettingsContainerKeys {
  initial = "initial",
  text = "text",
  spacing = "spacing"
}

export enum ThSettingsRangeVariant {
  slider = "slider",
  numberField = "numberField"
}

export enum ThSheetTypes {
  popover = "popover",
  fullscreen = "fullscreen",
  dockedStart = "docked start",
  dockedEnd = "docked end",
  bottomSheet = "bottomSheet"
}

export enum ThSheetHeaderVariant {
  close = "close",
  previous = "previous"
}

export enum ThThemeKeys {
  light = "light",
  sepia = "sepia",
  dark = "dark",
  paper = "paper",
  contrast1 = "contrast1",
  contrast2 = "contrast2",
  contrast3 = "contrast3"
}

export enum ThLayoutDirection {
  rtl = "rtl",
  ltr = "ltr"
}

export enum ThLayoutStrategy {
  margin = "margin",
  lineLength = "lineLength",
  columns = "columns"
}

export enum ThLayoutOptions { 
  scroll = "scroll_option",
  paginated = "page_option"
}

export enum ThTextAlignOptions {
  publisher = "publisher",
  start = "start",
  justify = "justify"
}

export enum ThLineHeightOptions {
  publisher = "publisher",
  small = "small",
  medium = "medium",
  large = "large"
}