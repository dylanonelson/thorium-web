"use client";

import { Button, ButtonProps, Tooltip, TooltipProps, TooltipTrigger } from "react-aria-components";
import { TooltipTriggerProps } from "react-aria";

export interface ThActionButtonProps extends ButtonProps {
  label?: string,
  ref?: React.ForwardedRef<HTMLButtonElement>,
  compounds?: {
    /**
     * Props for the tooltipTrigger component. See `TooltipTriggerProps` for more information.
     */
    tooltipTrigger?: TooltipTriggerProps,
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
  compounds,
  children,
  ...props
}: ThActionButtonProps) => {  
  if (compounds) {
    return (
      <>
      <TooltipTrigger
        { ...compounds.tooltipTrigger }
      >
        <Button 
          ref={ ref }
          { ...props }
        >
          { children } 
        </Button>
        <Tooltip
          arrowBoundaryOffset={ 0 }
          { ...compounds.tooltip }
        >
          { compounds.label }
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