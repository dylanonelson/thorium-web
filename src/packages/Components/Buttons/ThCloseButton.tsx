import Close from "./assets/icons/close.svg";

import { ThActionButton, ThActionButtonProps } from "./ThActionButton";

export const ThCloseButton = ({
  label,
  ref,
  tooltip,
  ...props
}: ThActionButtonProps) => {
  const children = props.children;

  return (
    <ThActionButton
      ref={ ref }
      tooltip={ tooltip }
      { ...props }
    >
      { children 
        ? children 
        : <>
          <Close aria-hidden="true" focusable="false" /> 
          { label }
          </> 
      }
    </ThActionButton>
  )
}