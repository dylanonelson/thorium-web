import { RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import Close from "./assets/icons/close.svg";

import { Button, PressEvent, Tooltip, TooltipTrigger } from "react-aria-components";

export interface ICloseButton {
  ref?: React.ForwardedRef<HTMLButtonElement>;
  className?: string;
  label?: string;
  onPressCallback: (e: PressEvent) => void;
  withTooltip?: string;
}

export const CloseButton = ({
  ref,
  className,
  label,
  onPressCallback,
  withTooltip
}: ICloseButton) => {
  
  if (withTooltip) {
    return (
      <>
      <TooltipTrigger>
        <Button 
          ref={ ref }
          className={ className || readerSharedUI.closeButton } 
          aria-label={ label || Locale.reader.app.docker.close.trigger } 
          onPress={ onPressCallback }
        >
          <Close aria-hidden="true" focusable="false" />  
        </Button>
        <Tooltip
          className={ readerSharedUI.tooltip }
          placement="bottom" 
          offset={ RSPrefs.theming.icon.tooltipOffset || 0 }
        >
          { withTooltip }
        </Tooltip>
      </TooltipTrigger>
      </>
    )
  } else {
    return (
      <>
      <Button 
        ref={ ref }
        className={ className || readerSharedUI.closeButton } 
        aria-label={ label || Locale.reader.app.docker.close.trigger } 
        onPress={ onPressCallback }
      >
        <Close aria-hidden="true" focusable="false" />
      </Button>
      </>
    )
  }
}