import { ComponentType, SVGProps } from "react";
import { PressEvent, TooltipProps } from "react-aria-components";
import { DockingKeys } from "./docking";

export enum ActionKeys {
  fullscreen = "fullscreen",
  jumpToPosition = "jumpToPosition",
  settings = "settings",
  toc = "toc"
}

export enum ActionVisibility {
  always = "always",
  partially = "partially",
  overflow = "overflow"
}

export enum ActionComponentVariant {
  button = "iconButton",
  menu = "menuItem"
}

export interface IActionComponent {
  variant: ActionComponentVariant;
  associatedKey?: string;
}

export interface IActionIconProps {
  className?: string;
  ariaLabel: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  placement: TooltipProps["placement"];
  tooltipLabel: string;
  visibility?: ActionVisibility;
  onPressCallback?: (e: PressEvent) => void;
  isDisabled?: boolean;
}

export interface IOverflowMenuItemProp {
  label: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  shortcut?: string | null;
  onActionCallback?: () => void;
  id: string;
  isDisabled?: boolean;
}

export interface IActionsItem {
  Comp: React.FunctionComponent<IActionComponent>;
  key: ActionKeys | DockingKeys;
  associatedKey?: string;
}

export interface IActions {
  items: IActionsItem[];
  className: string;
  label: string;
}