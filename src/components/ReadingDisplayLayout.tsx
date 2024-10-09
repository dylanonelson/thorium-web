import React from "react";

import Locale from "../resources/locales/en.json";

import ScrollableIcon from "./assets/icons/scroll-icon.svg";
import PaginatedIcon from "./assets/icons/page-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import { RadioGroup, Radio } from "react-aria-components";

export const ReadingDisplayLayout = ({ isFXL }: { isFXL: boolean }) => {
  return (
    <>
      <div>
        <RadioGroup className={settingsStyles.readingDisplayLayoutPopover} orientation="horizontal" value={isFXL ? "page_option" : "scroll_option"}>
          <Radio className={settingsStyles.readingDisplayLayoutRadio} value="scroll_option" id="scroll_option" isDisabled={isFXL}>
            <ScrollableIcon aria-hidden="true" focusable="false" />
            <span>{Locale.reader.settings.scrolled}</span>
          </Radio>
          <Radio className={settingsStyles.readingDisplayLayoutRadio} value="page_option" id="scroll_option" isDisabled={false}>
            <PaginatedIcon aria-hidden="true" focusable="false" />
            <span>{Locale.reader.settings.paginated}</span>
          </Radio>
        </RadioGroup>
      </div>
    </>
  )
}