export interface ILayoutDefaults {
  dockingWidth: number;
  scrim: string;
}

export interface IReaderArrow {
  direction: "left" | "right";
  occupySpace: boolean;
  className?: string;
  disabled: boolean;
  onPressCallback: () => void;
}