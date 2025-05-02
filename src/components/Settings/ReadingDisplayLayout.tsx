import React, { useCallback } from "react";

import Locale from "../../resources/locales/en.json";

import { ReadingDisplayLayoutOptions } from "@/models/layout";

import ScrollableIcon from "../assets/icons/contract.svg";
import PaginatedIcon from "../assets/icons/docs.svg";

import { RadioGroupWrapper } from "./Wrappers/RadioGroupWrapper";

import { useEpubNavigator } from "@/hooks/useEpubNavigator";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setScroll } from "@/lib/settingsReducer";

export const ReadingDisplayLayout = () => {
  const isScroll = useAppSelector(state => state.settings.scroll);

  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences, handleScrollAffordances } = useEpubNavigator();

  const updatePreference = useCallback(async (value: string) => { 
    const derivedValue = value === ReadingDisplayLayoutOptions.scroll;
    await submitPreferences({ scroll: derivedValue });
    dispatch(setScroll(getSetting("scroll")));

    // [TMP] We need to handle this in multiple places due to the lack
    // of Injection API. This mounts and unmounts scroll affordances
    handleScrollAffordances(derivedValue);
  }, [submitPreferences, getSetting, dispatch, handleScrollAffordances]);

  return (
    <>
    <RadioGroupWrapper
      standalone={ true }
      label={ Locale.reader.settings.layout.title }
      orientation="horizontal"
      value={ isScroll ? ReadingDisplayLayoutOptions.scroll : ReadingDisplayLayoutOptions.paginated }
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: PaginatedIcon,
          label: Locale.reader.settings.layout.paginated,
          value: ReadingDisplayLayoutOptions.paginated
        },
        {
          icon: ScrollableIcon,
          label: Locale.reader.settings.layout.scrolled,
          value: ReadingDisplayLayoutOptions.scroll
        }
      ]} 
    />
    </>
  )
}