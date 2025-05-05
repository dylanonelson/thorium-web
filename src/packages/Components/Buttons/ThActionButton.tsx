import { Button, ButtonProps, Tooltip, TooltipProps, TooltipTrigger } from "react-aria-components";
import { TooltipTriggerProps } from "react-aria";

export interface ThActionButtonProps extends ButtonProps {
  label?: string,
  ref?: React.ForwardedRef<HTMLButtonElement>,
  tooltip?: {
    trigger: TooltipTriggerProps,
    tooltip: TooltipProps,
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