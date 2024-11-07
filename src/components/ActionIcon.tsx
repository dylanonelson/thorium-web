import React, { ComponentType, SVGProps } from "react";

import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import { Button, Tooltip, TooltipTrigger, TooltipProps } from "react-aria-components";

export interface IActionIconProps {
  className: string;
  ariaLabel: string;
  SVG: ComponentType<SVGProps<SVGElement>>;
  placement: TooltipProps["placement"];
  tooltipLabel: string;
}

export const ActionIcon = ({
  className,
  ariaLabel, 
  SVG,
  placement,
  tooltipLabel
}: IActionIconProps) => {

  return (
    <>
    <TooltipTrigger>
      <Button 
        className={ className } 
        aria-label={ ariaLabel }
      >
        <SVG aria-hidden="true" focusable="false" />
      </Button>
      <Tooltip
        className={ readerSharedUI.tooltip }
        placement={ placement }
      >
        { tooltipLabel }
      </Tooltip>
    </TooltipTrigger>
    </>
  )
};