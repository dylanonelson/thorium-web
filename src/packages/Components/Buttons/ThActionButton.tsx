"use client";

import { Button, ButtonProps, Tooltip, TooltipProps, TooltipTrigger } from "react-aria-components";
import { TooltipTriggerProps } from "react-aria";

export interface ThActionButtonProps extends ButtonProps {
  label?: string,
  ref?: React.ForwardedRef<HTMLButtonElement>,
  tooltip?: {
    /**
     * Props for the tooltipTrigger component. See `TooltipTriggerProps` for more information.
     */
    trigger?: TooltipTriggerProps,
    /**
     * Props for the tooltip component. See `TooltipProps` for more information.
     */
    tooltip?: TooltipProps,
    /**
     * String for the tooltip
     */
    label: string 
  }
}

export const ThActionButton = ({
  ref,
  tooltip,
  children,
  ...props
}: ThActionButtonProps) => {  
  if (tooltip) {
    return (
      <>
      <TooltipTrigger
        { ...tooltip.trigger }
      >
        <Button 
          ref={ ref }
          { ...props }
        >
          { children } 
        </Button>
        <Tooltip
          arrowBoundaryOffset={ 0 }
          { ...tooltip.tooltip }
        >
          { tooltip.label }
        </Tooltip>
      </TooltipTrigger>
      </>
    )
  } else {
    return (
      <>
      <Button 
        { ...props }
      >
        { children }
      </Button>
      </>
    )
  }
}