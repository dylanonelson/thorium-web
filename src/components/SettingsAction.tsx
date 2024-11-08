import React from "react";

import Locale from "../resources/locales/en.json";

import TextAreaIcon from "./assets/icons/textarea-icon.svg";
import CloseIcon from "./assets/icons/close-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { ActionIcon } from "./ActionIcon"; 
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";

import { setSettingsOpen } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const SettingsAction = () => {
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const dispatch = useAppDispatch();

  const toggleSettingsState = (value: boolean) => {
    dispatch(setSettingsOpen(value));
  }

  return(
    <>
    <DialogTrigger onOpenChange={(val) => toggleSettingsState(val)}>
      <ActionIcon 
        className={ readerSharedUI.icon } 
        ariaLabel={ Locale.reader.settings.trigger }
        SVG={ TextAreaIcon } 
        placement="bottom" 
        tooltipLabel={ Locale.reader.app.actions.settings }
      />
      <Popover 
        placement="bottom" 
        className={ settingsStyles.readerSettingsPopover }
        >
        <Dialog>
          {({ close }) => (
            <>
            <Button 
              className={ settingsStyles.closeButton } 
              aria-label={ Locale.reader.settings.close } 
              onPress={ close }
            >
              <CloseIcon aria-hidden="true" focusable="false" />
            </Button>
            <ReadingDisplayCol />
            <hr/>
            <ReadingDisplayLayout isFXL={ isFXL } />
            </>
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
    </>
  )
}