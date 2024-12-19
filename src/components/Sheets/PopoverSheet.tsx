import React, { ReactElement, ReactNode } from "react";

import Locale from "../../resources/locales/en.json";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";

import CloseIcon from "../assets/icons/close.svg";

import { Button, Dialog, DialogTrigger, Popover, PopoverProps } from "react-aria-components";
import { IActionIconProps } from "../Templates/ActionIcon";

export interface IPopoverSheet {
  renderActionIcon: () => ReactElement<IActionIconProps>;
  className: string;
  isOpen: boolean;
  onOpenChangeCallback: (isOpen: boolean) => void;
  closeLabel: string;
  onClosePressCallback: () => void;
  placement?: PopoverProps["placement"];
  children?: ReactNode;
}

export const PopoverSheet: React.FC<IPopoverSheet> = ({ 
  renderActionIcon,
  className, 
  isOpen,
  onOpenChangeCallback, 
  closeLabel,
  onClosePressCallback,
  placement, 
  children }) => {

  const action = renderActionIcon();

  return (
  <>
  { React.Children.toArray(children).length > 0 
    ? <DialogTrigger>
        { action }
        <Popover 
          placement={ placement || "bottom" }
          className={ className }
          isOpen={ isOpen }
          onOpenChange={ onOpenChangeCallback } 
        >
          <Dialog>
            <Button 
              className={ readerSharedUI.closeButton } 
              aria-label={ closeLabel } 
              onPress={ onClosePressCallback }
            >
              <CloseIcon aria-hidden="true" focusable="false" />
            </Button>
            { children }
          </Dialog>
        </Popover>
      </DialogTrigger>
  : <></> }
  </>
  )
}