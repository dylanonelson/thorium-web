import { ComponentType, ReactNode, RefObject, SVGProps } from "react";
import { PressEvent, TooltipProps } from "react-aria-components";
import { DockingKeys, IDockedPref } from "./docking";
import { StaticBreakpoints } from "./staticBreakpoints";
import { ISnappedPref, SheetTypes } from "./sheets";
import { Collapsibility } from "./collapsibility";
import { ActionsStateKeys } from "./state/actionsState";

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
  associatedKey?: ActionsStateKeys;
}

export interface IActions {
  id: string;
  items: IActionsItem[];
  className: string;
  label: string;
}

export interface IActionsWithCollapsibility extends IActions {
  prefs: any;
  overflowActionCallback?: boolean;
  overflowMenuClassName?: string;
  overflowMenuDisplay?: boolean;
}

export interface IActionsItem {
  Comp: React.FunctionComponent<IActionComponent>;
  key: ActionKeys | DockingKeys;
  associatedKey?: ActionsStateKeys;
}

export interface IActionIconProps {
  className?: string;
  ref?: RefObject<HTMLButtonElement | null>;
  ariaLabel: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  placement: TooltipProps["placement"];
  tooltipLabel: string;
  visibility?: ActionVisibility;
  onPressCallback?: (e: PressEvent) => void;
  isDisabled?: boolean;
}

export interface IOverflowMenu {
  id: string;
  className?: string;
  actionFallback?: boolean;
  display: boolean;
  children?: ReactNode;
}

export interface IOverflowMenuItemProp {
  label: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  shortcut?: string | null;
  onActionCallback?: () => void;
  id: string;
  isDisabled?: boolean;
}

export interface ICloseButton {
  ref?: React.ForwardedRef<HTMLButtonElement>;
  className?: string;
  label?: string;
  onPressCallback: (e: PressEvent) => void;
  withTooltip?: string;
}

export interface IActionTokens {
  visibility: ActionVisibility;
  shortcut: string | null;
  sheet?: {
    defaultSheet: Exclude<SheetTypes, SheetTypes.dockedStart | SheetTypes.dockedEnd>;
    breakpoints: {
      [key in StaticBreakpoints]?: SheetTypes;
    }
  };
  docked?: IDockedPref;
  snapped?: ISnappedPref;
};

export interface IActionPref {
  displayOrder: ActionKeys[];
  collapse: Collapsibility;
  keys: {
    [key in ActionKeys]: IActionTokens;
  }
};