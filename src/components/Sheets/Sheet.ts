import { ReactElement, ReactNode } from "react"
import { IActionIconProps } from "../Templates/ActionIcon";

export enum SheetTypes {
  popover = "popover",
  fullscreen = "fullscreen"
}

export interface ISheet {
  renderActionIcon: () => ReactElement<IActionIconProps>;
  className: string;
  isOpen: boolean;
  onOpenChangeCallback: (isOpen: boolean) => void;
  closeLabel: string;
  onClosePressCallback: () => void;
  children?: ReactNode;
}