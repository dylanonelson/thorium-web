import React from "react";

import Locale from "../resources/locales/en.json";

import TextAreaIcon from "./assets/icons/textarea-icon.svg";
import CloseIcon from "./assets/icons/close-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"; 
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";

import { setHovering, setSettingsOpen } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const ReaderSettings = () => {
  const isOpen = useAppSelector(state => state.reader.settingsOpen);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const dispatch = useAppDispatch();

  const setOpen = (value: boolean) => {
    dispatch(setSettingsOpen(value));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  return(
    <>
    <DialogTrigger>
      <Button 
        className={ settingsStyles.textAreaButton } 
        aria-label={ Locale.reader.settings.trigger }
        onPress={ () => setOpen(true) }     
      >
        <TextAreaIcon aria-hidden="true" focusable="false" />
      </Button>
      <Popover 
        placement="bottom" 
        className={ settingsStyles.readerSettingsPopover }
        isOpen={ isOpen }
        onOpenChange={ setOpen } 
        >
        <Dialog>
          <Button 
            className={ settingsStyles.closeButton } 
            aria-label={ Locale.reader.settings.close } 
            onPress={ () => setOpen(false) }
          >
            <CloseIcon aria-hidden="true" focusable="false" />
          </Button>
          <ReadingDisplayCol />
          <hr/>
          <ReadingDisplayLayout isFXL={ isFXL } />
        </Dialog>
      </Popover>
    </DialogTrigger>
    </>
  )
}