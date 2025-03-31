import React from "react";

import Locale from "../../resources/locales/en.json";

import { ReadingDisplayLayoutOptions } from "@/models/layout";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import ScrollableIcon from "../assets/icons/contract.svg";
import PaginatedIcon from "../assets/icons/docs.svg";

import { RadioGroup, Radio, Label } from "react-aria-components";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppSelector } from "@/lib/hooks";

export const ReadingDisplayLayout = () => {
  const isScroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);

  const { applyScroll } = useEpubNavigator();

  const handleChange = async (value: string) => {    
    if (value === ReadingDisplayLayoutOptions.paginated) {
      await applyScroll(false);
    } else {
      await applyScroll(true);
    }
  };

  return (
    <>
    <RadioGroup 
      orientation="horizontal" 
      value={ isScroll ? ReadingDisplayLayoutOptions.scroll : ReadingDisplayLayoutOptions.paginated } 
      onChange={ async (val: string) => await handleChange(val) } 
      className={ settingsStyles.readerSettingsGroup }
    >
      <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.layout.title }</Label>
      <div className={ settingsStyles.readerSettingsRadioWrapper }>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ ReadingDisplayLayoutOptions.paginated } 
          id={ ReadingDisplayLayoutOptions.paginated } 
          isDisabled={ false }
        >
          <PaginatedIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.layout.paginated }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ ReadingDisplayLayoutOptions.scroll } 
          id={ ReadingDisplayLayoutOptions.scroll } 
          isDisabled={ isFXL }
        >
          <ScrollableIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.layout.scrolled }</span>
        </Radio>
      </div>
    </RadioGroup>
    </>
  )
}