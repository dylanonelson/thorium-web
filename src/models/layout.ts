export enum LayoutDirection {
  ltr = "ltr",
  rtl = "rtl"
}

export enum ReadingDisplayLayoutOption { 
  scroll = "scroll_option",
  paginated = "page_option"
}

export interface IReaderArrow {
  direction: "left" | "right";
  className?: string;
  disabled: boolean;
  onPressCallback: () => void;
}