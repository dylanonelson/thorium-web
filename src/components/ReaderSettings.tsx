import React from "react";

import GearIcon from "./assets/icons/gear-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import { ReadingDisplayLayout } from "./ReadingDisplayLayout";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"; 

export const ReaderSettings = ({ isFXL }: { isFXL: boolean }) => {

  return(
    <>
    <DialogTrigger>
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