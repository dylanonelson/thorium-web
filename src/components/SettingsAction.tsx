import React from "react";

import { ActionKeys, RSPrefs } from "@/preferences";
import Locale from "../resources/locales/en.json";

import TextAreaIcon from "./assets/icons/textarea-icon.svg";
import CloseIcon from "./assets/icons/close-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import { Button, Dialog, DialogTrigger, Popover, Separator } from "react-aria-components";
import { ActionIcon } from "./Templates/ActionIcon";
import { OverflowMenuItem } from "./Templates/OverflowMenuItem";
import { ActionComponentVariant, IActionComponent } from "./Templates/ActionComponent";
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";

import { setSettingsOpen } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const SettingsAction: React.FC<IActionComponent> = ({ variant }) => {
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const dispatch = useAppDispatch();

  const toggleSettingsState = (value: boolean) => {
    dispatch(setSettingsOpen(value));
  }

  if (variant && variant === ActionComponentVariant.menu) {
    return(
      <>
        <OverflowMenuItem 
          label={ Locale.reader.settings.trigger }
          SVG={ TextAreaIcon }
          shortcut={ RSPrefs.actions.settings.shortcut } 
          id={ ActionKeys.settings }
        />
      </>
    )
  } else {
    return(
      <>
      <DialogTrigger onOpenChange={(val) => toggleSettingsState(val)}>
        <ActionIcon 
          ariaLabel={ Locale.reader.settings.trigger }
          SVG={ TextAreaIcon } 
          placement="bottom" 
          tooltipLabel={ Locale.reader.settings.tooltip }
        />
        <Popover 
          placement="bottom" 
          className={ settingsStyles.readerSettingsPopover }
          >
          <Dialog>
            {({ close }) => (
              <>
              <Button 
                className={ readerSharedUI.closeButton } 
                aria-label={ Locale.reader.settings.close } 
                onPress={ close }
              >
                <CloseIcon aria-hidden="true" focusable="false" />
              </Button>
              <ReadingDisplayCol />
              <Separator/>
              <ReadingDisplayLayout isFXL={ isFXL } />
              </>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
      </>
    )
  }
}