import { useCallback, useEffect } from "react";

import Locale from "../../resources/locales/en.json";

import { RSLayoutStrategy } from "@/models/layout";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import FitIcon from "../assets/icons/fit_width.svg";
import RangeIcon from "../assets/icons/arrow_range.svg";
import AddColumnIcon from "../assets/icons/add_column_right.svg";

import { Label, Radio, RadioGroup } from "react-aria-components";
import { ReadingDisplayMaxChars } from "./ReadingDisplayMaxChars";

import { useAppSelector } from "@/lib/hooks";
import { useEpubNavigator } from "@/hooks/useEpubNavigator";

export const ReadingDisplayLayoutStrategy = () => {
  const layoutStrategy = useAppSelector(state => state.reader.layoutStrategy);
  const isPaged = useAppSelector(state => state.reader.isPaged);
  const colCount = useAppSelector(state => state.reader.colCount);

  const { applyLayoutStrategy } = useEpubNavigator();

  const handleChange = useCallback(async (value: string) => {
    await applyLayoutStrategy(value as RSLayoutStrategy);
  }, [applyLayoutStrategy]);

  useEffect(() => {
    if (colCount !== "auto" && layoutStrategy === RSLayoutStrategy.columns) {
      handleChange(RSLayoutStrategy.lineLength);
    }
  }, [colCount, layoutStrategy, handleChange]);

  return(
    <>
    <RadioGroup 
      orientation="horizontal" 
      value={ layoutStrategy } 
      onChange={ async (val: string) => await handleChange(val) } 
      className={ settingsStyles.readerSettingsGroup }
    >
      <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.layoutStrategy.title }</Label>
      <div className={ settingsStyles.readerSettingsRadioWrapper }>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ RSLayoutStrategy.margin } 
          id={ RSLayoutStrategy.margin } 
        >
          <FitIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.layoutStrategy.margin }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ RSLayoutStrategy.lineLength } 
          id={ RSLayoutStrategy.lineLength } 
        >
          <RangeIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.layoutStrategy.lineLength }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ RSLayoutStrategy.columns } 
          id={ RSLayoutStrategy.columns } 
          isDisabled={ !isPaged || colCount !== "auto" } 
        >
          <AddColumnIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.layoutStrategy.columns }</span>
        </Radio>
      </div>
    </RadioGroup>
    <ReadingDisplayMaxChars />
    </>
  )
}