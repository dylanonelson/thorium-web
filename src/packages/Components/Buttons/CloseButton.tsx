import Close from "./assets/icons/close.svg";

import { ActionButton, ActionButtonProps } from "./ActionButton";

export const CloseButton = ({
  label,
  ref,
  tooltip,
  ...props
}: ActionButtonProps) => {
  const children = props.children;

  return (
    <ActionButton
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
    </ActionButton>
  )
}