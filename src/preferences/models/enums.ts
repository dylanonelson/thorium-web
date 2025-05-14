export enum ActionKeys {
  fullscreen = "fullscreen",
  jumpToPosition = "jumpToPosition",
  layoutStrategy = "layoutStrategy",
  settings = "settings",
  toc = "toc"
}

export enum DockingKeys {
  start = "dockingStart",
  end = "dockingEnd",
  transient = "dockingTransient"
}

export enum DockingTypes {
  none = "none",
  both = "both",
  start = "start",
  end = "end"
}

export enum ScrollBackTo {
  top = "top",
  bottom = "bottom",
  untouched = "untouched"
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

export enum SettingsContainerKeys {
  initial = "initial",
  text = "text",
  spacing = "spacing"
}

export enum SettingsRangeVariant {
  slider = "slider",
  numberField = "numberField"
}

export enum TextSettingsKeys {
  align = "align",
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  normalizeText = "normalizeText"
}

export enum SpacingSettingsKeys {
  letterSpacing = "letterSpacing",
  lineHeight = "lineHeight",
  paraIndent = "paraIndent",
  paraSpacing = "paraSpacing",
  publisherStyles = "publisherStyles",
  wordSpacing = "wordSpacing"
}

export enum SheetTypes {
  popover = "popover",
  fullscreen = "fullscreen",
  dockedStart = "docked start",
  dockedEnd = "docked end",
  bottomSheet = "bottomSheet"
}

export enum SheetHeaderVariant {
  close = "close",
  previous = "previous"
}

export enum ThemeKeys {
  auto = "auto",
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

export enum LayoutOptions { 
  scroll = "scroll_option",
  paginated = "page_option"
}

export enum TextAlignOptions {
  publisher = "publisher",
  start = "start",
  justify = "justify"
}

export enum LineHeightOptions {
  publisher = "publisher",
  small = "small",
  medium = "medium",
  large = "large"
}