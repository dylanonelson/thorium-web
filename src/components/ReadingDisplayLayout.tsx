import React from "react";

import Locale from "../resources/locales/en.json";

import ScrollableIcon from "./assets/icons/scroll-icon.svg";
import PaginatedIcon from "./assets/icons/page-icon.svg";
import settingsStyles from "./assets/styles/readerSettings.module.css";

import { control } from "../helpers/control";

import { RadioGroup, Radio, Label } from "react-aria-components";
import { setPaged } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export enum ReadingDisplayLayoutOption { 
  scroll = "scroll_option",
  paginated = "page_option"
}

export const ReadingDisplayLayout = ({ isFXL }: { isFXL: boolean }) => {
  const isPaged = useAppSelector(state => state.reader.isPaged);
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    if (value === ReadingDisplayLayoutOption.paginated) {
      dispatch(setPaged(true));
    } else {
      dispatch(setPaged(false));
    }
    control("switchDisplayLayout", value);
  }
  
  return (
    <>
      <div>
        <RadioGroup className={settingsStyles.readingDisplayLayoutPopover} orientation="horizontal" value={isPaged ? ReadingDisplayLayoutOption.paginated : ReadingDisplayLayoutOption.scroll} onChange={handleChange}>
          <Label className={settingsStyles.readingDisplayLayoutLabel}>{Locale.reader.settings.readingDisplayLayout}</Label>
          <div className={settingsStyles.readingDisplayLayoutRadioWrapper}>
            <Radio className={settingsStyles.readingDisplayLayoutRadio} value={ReadingDisplayLayoutOption.scroll} id={ReadingDisplayLayoutOption.scroll} isDisabled={isFXL}>
              <ScrollableIcon aria-hidden="true" focusable="false" />
              <span>{Locale.reader.settings.scrolled}</span>
            </Radio>
            <Radio className={settingsStyles.readingDisplayLayoutRadio} value={ReadingDisplayLayoutOption.paginated} id={ReadingDisplayLayoutOption.paginated} isDisabled={false}>
              <PaginatedIcon aria-hidden="true" focusable="false" />
              <span>{Locale.reader.settings.paginated}</span>
            </Radio>
          </div>
        </RadioGroup>
      </div>
    </>
  )
}