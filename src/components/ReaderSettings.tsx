import React, { useContext } from "react";

import GearIcon from "./assets/icons/gear-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import { ReadingDisplayLayout } from "./ReadingDisplayLayout";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"; 
import { ReaderState } from "@/app-context/readerState";

export const ReaderSettings = ({ isFXL }: { isFXL: boolean }) => {
  const { updateState } = useContext(ReaderState);

  const toggleSettingsState = (value: boolean) => {
    updateState({ settingsOpen: value });
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