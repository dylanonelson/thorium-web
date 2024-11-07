import React from "react";

import Locale from "../resources/locales/en.json";

import TextAreaIcon from "./assets/icons/textarea-icon.svg";
import CloseIcon from "./assets/icons/close-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import { Button, Dialog, DialogTrigger, Popover, Tooltip, TooltipTrigger } from "react-aria-components"; 
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";

import { setSettingsOpen } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const ReaderSettings = () => {
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const dispatch = useAppDispatch();

  const toggleSettingsState = (value: boolean) => {
    dispatch(setSettingsOpen(value));
  }

  return(
    <>
    <DialogTrigger onOpenChange={(val) => toggleSettingsState(val)}>
      <TooltipTrigger>
        <Button 
          className={ settingsStyles.textAreaButton } 
          aria-label={ Locale.reader.settings.trigger }
        >
          <TextAreaIcon aria-hidden="true" focusable="false" />
        </Button>
        <Tooltip
        className={ readerSharedUI.tooltip }
        placement="bottom">
        { Locale.reader.app.actions.settings }
      </Tooltip>
      </TooltipTrigger>
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