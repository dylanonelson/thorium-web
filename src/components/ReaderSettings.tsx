import React, { useRef, useState } from "react";

import Locale from "../resources/locales/en.json";

import TextAreaIcon from "./assets/icons/textarea-icon.svg";
import CloseIcon from "./assets/icons/close-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import { Button, Dialog, DialogTrigger, Popover, PressEvent } from "react-aria-components"; 
import { ReadingDisplayCol } from "./ReadingDisplayCol";
import { ReadingDisplayLayout } from "./ReadingDisplayLayout";

import { setHovering, setImmersive, setSettingsOpen } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const ReaderSettings = () => {
  const triggerButton = useRef<HTMLButtonElement | null>(null);
  const [isDismissed, setDismissed] = useState(false);
  const isOpen = useAppSelector(state => state.reader.settingsOpen);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const dispatch = useAppDispatch();

  // TMP: Vanilla React ARIA popover/modal components don’t provide a prop
  // to prevent restoring of focus onto trigger on dismissal
  // so we have to build custom components using hooks and focus utilities…
  // We need to for actions and sheets anyway so no biggie, but in the meantime,
  // we have to do this funky logic so that the behaviour can be tested and refined.

  const setOpen = (value: boolean) => {
    dispatch(setSettingsOpen(value));

    // hover false otherwise it tends to stay on close button press…
    if (!value) dispatch(setHovering(false));
  }

  // Intercepting CloseOnInteractOutside only to set various states…
  const proxyCloseOnInteractOutside = () => {
    // setting dismissed so that we can blur the trigger on focus…
    setDismissed(true);
    // setting immersive so that it doesn’t require 2 clicks…
    dispatch(setImmersive(true));
    // hover false otherwise it may not update as expected
    dispatch(setHovering(false));
    // Allow press on ARIA underlay to trigger close
    return true;
  }

  const handleCloseButton = (event: PressEvent) => {
    // If the event is anything else than keyboard, set dismissed
    // The assumption is that you want to restore focus for keyboard nav
    if (event.pointerType !== "keyboard") {
      setDismissed(true);
    }
    // close the popover
    setOpen(false);
  }

  // Check the trigger Button is dismissed and is in immersive mode to blur it
  // when the focus is restored from the popover overlay
  // We need to know whether it’s dismissed so that we don’t accidentally blur it
  // and it becomes unavailable through keyboard nav…
  const handleFocus = () => {
    if (isDismissed && isImmersive && triggerButton.current) {
      // reset dismissed so that trigger can become focusable again
      setDismissed(false);
      triggerButton.current.blur();
    }
  }

  return(
    <>
    <DialogTrigger>
      <Button 
        ref={ triggerButton }
        className={ settingsStyles.textAreaButton } 
        aria-label={ Locale.reader.settings.trigger }
        onPress={ () => setOpen(true) }
        onFocus={ handleFocus }       
      >
        <TextAreaIcon aria-hidden="true" focusable="false" />
      </Button>
      <Popover 
        placement="bottom" 
        className={ settingsStyles.readerSettingsPopover }
        isOpen={ isOpen }
        onOpenChange={ setOpen } 
        shouldCloseOnInteractOutside={ proxyCloseOnInteractOutside }
        >
        <Dialog>
          <Button 
            className={ settingsStyles.closeButton } 
            aria-label={ Locale.reader.settings.close } 
            onPress={ handleCloseButton }
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