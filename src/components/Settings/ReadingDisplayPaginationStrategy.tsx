import { useCallback } from "react";

import Locale from "../../resources/locales/en.json";

import { PaginationStrategy } from "@/models/preferences";

import settingsStyles from "../assets/styles/readerSettings.module.css";

import RangeIcon from "../assets/icons/arrow_range.svg";
import AddColumnIcon from "../assets/icons/add_column_right.svg";

import { Label, Radio, RadioGroup } from "react-aria-components";

import { useAppSelector } from "@/lib/hooks";
import { useEpubNavigator } from "@/hooks/useEpubNavigator";

export const ReadingDisplayPaginationStrategy = () => {
  const paginationStrategy = useAppSelector(state => state.reader.paginationStrategy);
  const colCount = useAppSelector(state => state.reader.colCount);

  const { applyPaginationStrategy } = useEpubNavigator();

  const handleChange = useCallback(async (value: string) => {
      await applyPaginationStrategy(value as PaginationStrategy);
    }, [applyPaginationStrategy]);

  return(
    <>
    <RadioGroup 
      orientation="horizontal" 
      value={ paginationStrategy } 
      onChange={ async (val: string) => await handleChange(val) } 
      className={ settingsStyles.readerSettingsGroup }
    >
      <Label className={ settingsStyles.readerSettingsLabel }>{ Locale.reader.settings.paginationStrategy.title }</Label>
      <div className={ settingsStyles.readerSettingsRadioWrapper }>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ PaginationStrategy.lineLength } 
          id={ PaginationStrategy.lineLength } 
          isDisabled={ colCount !== "auto" }
        >
          <RangeIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.paginationStrategy.lineLength }</span>
        </Radio>
        <Radio 
          className={ settingsStyles.readerSettingsRadio } 
          value={ PaginationStrategy.columns } 
          id={ PaginationStrategy.columns } 
          isDisabled={ colCount !== "auto" } 
        >
          <AddColumnIcon aria-hidden="true" focusable="false" />
          <span>{ Locale.reader.settings.paginationStrategy.columns }</span>
        </Radio>
      </div>
    </RadioGroup>
    </>
  )
}