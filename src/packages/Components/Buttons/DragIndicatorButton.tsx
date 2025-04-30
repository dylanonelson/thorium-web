import HorizontalRule from "./assets/icons/horizontal_rule.svg";

import { Button, ButtonProps } from "react-aria-components";

export const DragIndicatorButton = ({
  ...props
}: ButtonProps) => {
  return (
    <>
    <Button 
      { ...props }
    >
      <HorizontalRule aria-hidden="true" focusable="false" />
    </Button>
    </>
  )
}