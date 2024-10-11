import React from "react";

import GearIcon from "./assets/icons/gear-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import { ReadingDisplayLayout } from "./ReadingDisplayLayout";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"; 
import { setSettingsOpen } from "@/lib/readerReducer";
import { useAppDispatch } from "@/lib/hooks";

export const ReaderSettings = ({ isFXL }: { isFXL: boolean }) => {
  const dispatch = useAppDispatch();

  const toggleSettingsState = (value: boolean) => {
    dispatch(setSettingsOpen(value));
  }

  return(
    <>
    <DialogTrigger onOpenChange={(val) => toggleSettingsState(val)}>
      <Button className={settingsStyles.gearButton}>
        <GearIcon aria-hidden="true" focusable="false" />
      </Button>
      <Popover placement="bottom">
        <Dialog>
          <ReadingDisplayLayout isFXL={isFXL} />
        </Dialog>
      </Popover>
    </DialogTrigger>
    </>
  )
}