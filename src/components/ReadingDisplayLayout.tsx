import React, { useState } from "react";

import Locale from "../resources/locales/en.json";

import ScrollableIcon from "./assets/icons/scroll-icon.svg";
import PaginatedIcon from "./assets/icons/page-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import { RadioGroup, Radio, Label } from "react-aria-components";

export const ReadingDisplayLayout = ({ isFXL }: { isFXL: boolean }) => {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <>
      <div>
        <RadioGroup className={settingsStyles.readingDisplayLayoutPopover} orientation="horizontal" value={selected} onChange={setSelected}>
          <Label className={settingsStyles.readingDisplayLayoutLabel}>{Locale.reader.settings.readingDisplayLayout}</Label>
          <div className={settingsStyles.readingDisplayLayoutRadioWrapper}>
            <Radio className={settingsStyles.readingDisplayLayoutRadio} value="scroll_option" id="scroll_option" isDisabled={isFXL}>
              <ScrollableIcon aria-hidden="true" focusable="false" />
              <span>{Locale.reader.settings.scrolled}</span>
            </Radio>
            <Radio className={settingsStyles.readingDisplayLayoutRadio} value="page_option" id="page_option" isDisabled={false}>
              <PaginatedIcon aria-hidden="true" focusable="false" />
              <span>{Locale.reader.settings.paginated}</span>
            </Radio>
          </div>
        </RadioGroup>
      </div>
    </>
  )
}