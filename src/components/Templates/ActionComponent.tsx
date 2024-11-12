import React, { ComponentType, SVGProps } from "react";

import { PressEvent, TooltipProps } from "react-aria-components";
import { ActionIcon } from "./ActionIcon";
import { OverflowMenuItem } from "./OverflowMenuItem";

export enum ActionComponentVariant {
  iconButton = "icon-button",
  menuItem = "menu-item"
}

export interface IActionComponent {
  variant?: ActionComponentVariant;
  label: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  placement?: TooltipProps["placement"];
  tooltipLabel: string;
  shortcut?: string;
  onActionCallback: () => void;
  onPressCallback?: (e: PressEvent) => void;
}

export const ActionComponent = ({ 
    variant,
    label, 
    SVG,
    placement,
    tooltipLabel, 
    shortcut,
    onActionCallback, 
    onPressCallback 
  }: IActionComponent) => {
  return(
    <>
    { variant && variant === ActionComponentVariant.menuItem
    ? <OverflowMenuItem 
        label={ label }
        SVG={ SVG }
        shortcut={ shortcut }
        onActionCallback={ onActionCallback } 
      />
    : <ActionIcon 
        ariaLabel={ label } 
        SVG={ SVG } 
        placement={ placement }
        tooltipLabel={ tooltipLabel }
        onPressCallback={ onPressCallback }
      />
    }
    </>
  )
}