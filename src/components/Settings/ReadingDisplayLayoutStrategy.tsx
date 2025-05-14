import { useCallback, useEffect } from "react";

import Locale from "../../resources/locales/en.json";

import { RSLayoutStrategy } from "@/models/layout";
import { LayoutStrategy } from "@readium/navigator";

import FitIcon from "../assets/icons/fit_width.svg";
import RangeIcon from "../assets/icons/arrow_range.svg";
import AddColumnIcon from "../assets/icons/add_column_right.svg";

import { RadioGroupWrapper } from "./Wrappers/RadioGroupWrapper";
import { ReadingDisplayLineLengths } from "./ReadingDisplayLineLengths";

import { useEpubNavigator } from "@/packages/Hooks/Epub/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLayoutStrategy } from "@/lib/settingsReducer";

export const ReadingDisplayLayoutStrategy = () => {
  const layoutStrategy = useAppSelector(state => state.settings.layoutStrategy);
  const isScroll = useAppSelector(state => state.settings.scroll);
  const columnCount = useAppSelector(state => state.settings.columnCount);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: string) => {
    await submitPreferences({ layoutStrategy: value as unknown as LayoutStrategy });

    dispatch(setLayoutStrategy(getSetting("layoutStrategy")));
  }, [submitPreferences, getSetting, dispatch]);

  useEffect(() => {
    const updateIfNeeded = async () => {
      if (columnCount !== "auto" && layoutStrategy === RSLayoutStrategy.columns) {
        await updatePreference(RSLayoutStrategy.lineLength);
      }
    };
    updateIfNeeded();
  }, [columnCount, layoutStrategy, updatePreference]);

  return(
    <>
    <RadioGroupWrapper 
      standalone={ true }
      label={ Locale.reader.layoutStrategy.title }
      orientation="horizontal"
      value={ layoutStrategy }
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: FitIcon,
          label: Locale.reader.layoutStrategy.margin,
          value: RSLayoutStrategy.margin,
        },
        {
          icon: RangeIcon,
          label: Locale.reader.layoutStrategy.lineLength,
          value: RSLayoutStrategy.lineLength,
        },
        {
          icon: AddColumnIcon,
          label: Locale.reader.layoutStrategy.columns,
          value: RSLayoutStrategy.columns,
          isDisabled: isScroll || columnCount !== "auto",
        }   
      ]}
    />
    <ReadingDisplayLineLengths />
    </>
  )
}