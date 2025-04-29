import { Button, ButtonProps, Tooltip, TooltipProps, TooltipTrigger } from "react-aria-components";
import { TooltipTriggerProps } from "react-aria";
import { LayoutDirection } from "@/models/layout";

export interface ActionButtonProps extends ButtonProps {
  label?: string,
  ref?: React.ForwardedRef<HTMLButtonElement>,
  tooltip?: {
    trigger: TooltipTriggerProps,
    tooltip: TooltipProps,
    label: string 
  }
}

export interface NavigationButtonProps extends ActionButtonProps {
  direction?: LayoutDirection
}

export const ActionButton = ({
  ref,
  tooltip,
  ...props
}: ActionButtonProps) => {
  const children = props.children;
  
  if (tooltip) {
    return (
      <>
      <TooltipTrigger
        delay={ tooltip.trigger.delay }
        closeDelay={ tooltip.trigger.closeDelay }
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